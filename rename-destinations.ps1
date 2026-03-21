$OldDir = "c:\Users\rishj\myclaw\estatemind-ai"
$NewDir = "c:\Users\rishj\myclaw\destinations-ai"

Write-Host "Renaming directory..."
Rename-Item -Path $OldDir -NewName "destinations-ai" -Force

Write-Host "Rebranding EstateMind -> Destinations..."
$ExcludeExts = @('.jpg', '.png', '.webp', '.ico', '.svg', '.gif')
Get-ChildItem -Path $NewDir -Recurse -File | Where-Object { $_.Extension -notin $ExcludeExts -and $_.FullName -notmatch ".git" } | ForEach-Object {
    try {
        $content = Get-Content $_.FullName -Raw -ErrorAction Stop
        $newContent = $content
        if ($newContent -match "estatemind|EstateMind|ESTATEMIND|blockwise|Blockwise|BLOCKWISE") {
            $newContent = $newContent -creplace "estatemind", "destinations"
            $newContent = $newContent -creplace "EstateMind", "Destinations"
            $newContent = $newContent -creplace "ESTATEMIND", "DESTINATIONS"

            # Also catch any lingering blockwise references
            $newContent = $newContent -creplace "blockwise", "destinations"
            $newContent = $newContent -creplace "Blockwise", "Destinations"
            $newContent = $newContent -creplace "BLOCKWISE", "DESTINATIONS"
            
            Set-Content -Path $_.FullName -Value $newContent -NoNewline
        }
    } catch {
        # Ignore binary or locked files
    }
}

Write-Host "Rebrand Complete!"
