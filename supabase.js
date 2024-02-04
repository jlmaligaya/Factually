import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bpfzmwxcibqsyzrpgyeg.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwZnptd3hjaWJxc3l6cnBneWVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzUwOTk3ODAsImV4cCI6MTk5MDY3NTc4MH0.OYM4ba2MoGZ4ASEoIOoEtaq-qCIsg_GnZcMUaj-OApA";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
