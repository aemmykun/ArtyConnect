@echo off
echo Creating .env.local file...
(
echo # Supabase Configuration
echo NEXT_PUBLIC_SUPABASE_URL=https://kapwuevjepihxaowwaaa.supabase.co
echo NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthcHd1ZXZqZXBpaHhhb3d3YWFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQwNDEyNzAsImV4cCI6MjA0OTYxNzI3MH0.abcdefghijklmnopqrstuvwxyz1234567890
) > .env.local
echo .env.local created successfully!
pause
