$repo = 'C:\Users\Housekeeping\OneDrive\Apps\ArtyConnect'
# Get ignored files (including untracked) using null-byte separator
$ignored = git -C $repo ls-files --others --ignored --exclude-standard -z
if (-not $ignored) { exit }
$files = $ignored -split "`0"
foreach ($f in $files) {
    if ([string]::IsNullOrWhiteSpace($f)) { continue }
    # Skip common large ignored dirs
    if ($f -like '*node_modules*' -or $f -like '*\.next*' -or $f -like '*\.git*') { continue }
    $fullPath = Join-Path $repo $f
    if (-not (Test-Path $fullPath)) { continue }
    # Read file as raw text
    $content = Get-Content -Path $fullPath -Raw -ErrorAction SilentlyContinue
    if ($null -eq $content) { continue }
    $lines = $content -split "`r?`n"
    if ($lines.Count -eq 1) {
        $line = $lines[0].Trim()
        Write-Output "$fullPath`t$line"
    }
}
