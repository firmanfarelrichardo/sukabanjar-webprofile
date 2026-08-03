const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://teelhwymklvldvyzfjzi.supabase.co";
const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlZWxod3lta2x2bGR2eXpmanppIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTQ2MzEyNCwiZXhwIjoyMTAxMDM5MTI0fQ.Ggzj0NaqihB2rsicCuTtj4PDDtpmu7f1umLsb3SoaTg";

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function testSupabaseBucket() {
  console.log('Testing Supabase Storage with Service Role Key for bucket sukabanjar-assets...');
  try {
    // 1. Try to list buckets
    const { data: buckets, error: listErr } = await supabase.storage.listBuckets();
    console.log('Buckets List Result:', buckets, 'Error:', listErr);

    // 2. Try to get or create sukabanjar-assets
    const targetBucket = 'sukabanjar-assets';
    const exists = buckets?.some(b => b.name === targetBucket);

    if (!exists) {
      console.log(`Bucket "${targetBucket}" does not exist, creating public bucket...`);
      const { data: createData, error: createErr } = await supabase.storage.createBucket(targetBucket, {
        public: true,
      });
      console.log('Create Bucket Result:', createData, 'Error:', createErr);
    } else {
      console.log(`Bucket "${targetBucket}" already exists!`);
    }

    // 3. Test uploading a dummy file to sukabanjar-assets
    const testBuffer = Buffer.from('Testing Supabase Storage Upload for Desa Suka Banjar');
    const testFileName = `test_${Date.now()}.txt`;
    const { data: uploadData, error: uploadErr } = await supabase.storage
      .from(targetBucket)
      .upload(`berita/${testFileName}`, testBuffer, {
        contentType: 'text/plain',
        upsert: true,
      });

    console.log('Upload Result:', uploadData, 'Error:', uploadErr);

    if (uploadData) {
      const { data: publicUrlData } = supabase.storage
        .from(targetBucket)
        .getPublicUrl(`berita/${testFileName}`);
      console.log('🎉 PUBLIC URL:', publicUrlData?.publicUrl);
    }
  } catch (err) {
    console.error('SUPABASE STORAGE ERROR:', err);
  }
}

testSupabaseBucket();
