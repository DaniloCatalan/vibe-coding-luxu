const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://ribyjdpwthkdulcxfxcw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpYnlqZHB3dGhrZHVsY3hmeGN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwNDE1NjIsImV4cCI6MjA4OTYxNzU2Mn0.mEEPQyhFrwWmqFgNbW0M2Wb7YgUNMeM5vD_Qzi4J_0I";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data, error } = await supabase.from("properties").select("*").limit(1);
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Keys:", Object.keys(data[0] || {}));
  }
}
check();
