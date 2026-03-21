$AimsFrontend = "c:\Users\rishj\OneDrive\Desktop\A.I.M.S\frontend"
$PerformDir = "c:\Users\rishj\myclaw\the-perform-platform"
$BlockwiseSrc = "c:\Users\rishj\OneDrive\Desktop\A.I.M.S\blockwise-ai"
$DestinationsDir = "c:\Users\rishj\myclaw\destinations-ai"

Write-Host "--- Extracting The-Perform-Platform ---"
$PerformApp = "$PerformDir\src\app"
$PerformComponents = "$PerformDir\src\components"
$PerformLib = "$PerformDir\src\lib"

# Create directories
New-Item -ItemType Directory -Force -Path "$PerformApp"
New-Item -ItemType Directory -Force -Path "$PerformComponents\perform"
New-Item -ItemType Directory -Force -Path "$PerformComponents\ui"
New-Item -ItemType Directory -Force -Path "$PerformLib\perform"

# Copy App routes
Write-Host "Copying perform routes..."
Copy-Item "$AimsFrontend\app\perform\*" "$PerformApp\" -Recurse -Force

# Copy Components
Write-Host "Copying perform components..."
Copy-Item "$AimsFrontend\components\perform\*" "$PerformComponents\perform\" -Recurse -Force
Copy-Item "$AimsFrontend\components\ui\*" "$PerformComponents\ui\" -Recurse -Force

# Copy Lib
Write-Host "Copying perform lib..."
Copy-Item "$AimsFrontend\lib\perform\*" "$PerformLib\perform\" -Recurse -Force
Copy-Item "$AimsFrontend\lib\utils.ts" "$PerformLib\" -Force

Write-Host "Done with perform copying."

Write-Host "--- Extracting Destinations-AI ---"
# Remove the default created elements inside Destinations-AI to replace with blockwise-ai clone
Remove-Item "$DestinationsDir\src" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "$DestinationsDir\components" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "$DestinationsDir\app" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "Copying Blockwise contents..."
Get-ChildItem -Path $BlockwiseSrc -Exclude "node_modules", ".next", ".git" | Copy-Item -Destination $DestinationsDir -Recurse -Force

Write-Host "Rebranding Blockwise -> Destinations..."
$ExcludeExts = @('.jpg', '.png', '.webp', '.ico', '.svg', '.gif')
Get-ChildItem -Path $DestinationsDir -Recurse -File | Where-Object { $_.Extension -notin $ExcludeExts } | ForEach-Object {
    try {
        $content = Get-Content $_.FullName -Raw -ErrorAction Stop
        if ($content -match "blockwise|Blockwise") {
            $content = $content -creplace "blockwise", "destinations"
            $content = $content -creplace "Blockwise", "Destinations"
            $content = $content -creplace "BLOCKWISE", "DESTINATIONS"
            Set-Content -Path $_.FullName -Value $content -NoNewline
        }
    } catch {
        # Ignore binary or locked files
    }
}

Write-Host "Extraction Pipeline Complete!"
