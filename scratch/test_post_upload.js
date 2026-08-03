const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://teelhwymklvldvyzfjzi.supabase.co";
const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlZWxod3lta2x2bGR2eXpmanppIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTQ2MzEyNCwiZXhwIjoyMTAxMDM5MTI0fQ.Ggzj0NaqihB2rsicCuTtj4PDDtpmu7f1umLsb3SoaTg";

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function testSupabaseUploadDirect() {
  console.log('Testing direct upload to bucket "sukabanjar-assets"...');
  const buffer = Buffer.from('Fake image content test for Suka Banjar web profile');
  const fileName = `berita/test_verify_${Date.now()}.jpg`;

  const { data, error } = await supabase.storage
    .from('sukabanjar-assets')
    .upload(fileName, buffer, {
      contentType: 'image/jpeg',
      upsert: true,
    });

  if (error) {
    console.error('❌ UPLOAD FAILED:', error);
    return;
  }

  const { data: publicUrlData } = supabase.storage
    .from('sukabanjar-assets')
    .getPublicUrl(fileName);

  console.log('✅ UPLOAD SUCCESS!');
  console.log('✅ BUCKET PATH:', data.path);
  console.log('✅ PUBLIC SUPABASE URL:', publicUrlData.publicUrl);
}

testSupabaseUploadDirect();
