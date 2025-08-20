-- Update existing custom folders with varied colors
-- Run this in your Supabase SQL Editor

-- Update existing folders with varied colors based on their names
UPDATE custom_folders 
SET color = CASE 
    -- Work/Professional related
    WHEN LOWER(name) LIKE '%work%' OR LOWER(name) LIKE '%job%' OR LOWER(name) LIKE '%career%' OR LOWER(name) LIKE '%office%' THEN 'bg-orange-500'
    WHEN LOWER(name) LIKE '%project%' OR LOWER(name) LIKE '%task%' OR LOWER(name) LIKE '%todo%' THEN 'bg-purple-500'
    WHEN LOWER(name) LIKE '%meeting%' OR LOWER(name) LIKE '%appointment%' THEN 'bg-blue-500'
    WHEN LOWER(name) LIKE '%client%' OR LOWER(name) LIKE '%customer%' THEN 'bg-cyan-500'
    WHEN LOWER(name) LIKE '%business%' OR LOWER(name) LIKE '%company%' THEN 'bg-slate-500'
    WHEN LOWER(name) LIKE '%finance%' OR LOWER(name) LIKE '%money%' OR LOWER(name) LIKE '%budget%' THEN 'bg-green-500'
    
    -- Education/Study related
    WHEN LOWER(name) LIKE '%study%' OR LOWER(name) LIKE '%learn%' OR LOWER(name) LIKE '%education%' THEN 'bg-green-500'
    WHEN LOWER(name) LIKE '%school%' OR LOWER(name) LIKE '%college%' OR LOWER(name) LIKE '%university%' THEN 'bg-blue-500'
    WHEN LOWER(name) LIKE '%course%' OR LOWER(name) LIKE '%class%' OR LOWER(name) LIKE '%lecture%' THEN 'bg-cyan-500'
    WHEN LOWER(name) LIKE '%research%' OR LOWER(name) LIKE '%lab%' THEN 'bg-purple-500'
    WHEN LOWER(name) LIKE '%science%' OR LOWER(name) LIKE '%experiment%' THEN 'bg-purple-500'
    WHEN LOWER(name) LIKE '%math%' OR LOWER(name) LIKE '%calculation%' THEN 'bg-blue-500'
    
    -- Technology/Coding related
    WHEN LOWER(name) LIKE '%coding%' OR LOWER(name) LIKE '%programming%' OR LOWER(name) LIKE '%dev%' THEN 'bg-blue-500'
    WHEN LOWER(name) LIKE '%tech%' OR LOWER(name) LIKE '%technology%' OR LOWER(name) LIKE '%software%' THEN 'bg-cyan-500'
    WHEN LOWER(name) LIKE '%web%' OR LOWER(name) LIKE '%website%' OR LOWER(name) LIKE '%site%' THEN 'bg-purple-500'
    WHEN LOWER(name) LIKE '%app%' OR LOWER(name) LIKE '%mobile%' OR LOWER(name) LIKE '%ios%' OR LOWER(name) LIKE '%android%' THEN 'bg-green-500'
    WHEN LOWER(name) LIKE '%database%' OR LOWER(name) LIKE '%data%' THEN 'bg-orange-500'
    WHEN LOWER(name) LIKE '%api%' OR LOWER(name) LIKE '%backend%' THEN 'bg-red-500'
    WHEN LOWER(name) LIKE '%frontend%' OR LOWER(name) LIKE '%ui%' OR LOWER(name) LIKE '%ux%' THEN 'bg-pink-500'
    WHEN LOWER(name) LIKE '%design%' OR LOWER(name) LIKE '%graphic%' THEN 'bg-pink-500'
    
    -- Personal/Lifestyle related
    WHEN LOWER(name) LIKE '%personal%' OR LOWER(name) LIKE '%private%' OR LOWER(name) LIKE '%life%' THEN 'bg-pink-500'
    WHEN LOWER(name) LIKE '%home%' OR LOWER(name) LIKE '%house%' OR LOWER(name) LIKE '%family%' THEN 'bg-green-500'
    WHEN LOWER(name) LIKE '%health%' OR LOWER(name) LIKE '%fitness%' OR LOWER(name) LIKE '%gym%' THEN 'bg-red-500'
    WHEN LOWER(name) LIKE '%sport%' OR LOWER(name) LIKE '%exercise%' OR LOWER(name) LIKE '%workout%' THEN 'bg-orange-500'
    WHEN LOWER(name) LIKE '%food%' OR LOWER(name) LIKE '%cooking%' OR LOWER(name) LIKE '%recipe%' THEN 'bg-yellow-500'
    WHEN LOWER(name) LIKE '%restaurant%' OR LOWER(name) LIKE '%dining%' THEN 'bg-orange-500'
    WHEN LOWER(name) LIKE '%travel%' OR LOWER(name) LIKE '%trip%' OR LOWER(name) LIKE '%vacation%' THEN 'bg-cyan-500'
    WHEN LOWER(name) LIKE '%car%' OR LOWER(name) LIKE '%vehicle%' OR LOWER(name) LIKE '%transport%' THEN 'bg-slate-500'
    WHEN LOWER(name) LIKE '%shopping%' OR LOWER(name) LIKE '%buy%' OR LOWER(name) LIKE '%purchase%' THEN 'bg-green-500'
    
    -- Entertainment/Media related
    WHEN LOWER(name) LIKE '%music%' OR LOWER(name) LIKE '%song%' OR LOWER(name) LIKE '%audio%' THEN 'bg-purple-500'
    WHEN LOWER(name) LIKE '%video%' OR LOWER(name) LIKE '%movie%' OR LOWER(name) LIKE '%film%' THEN 'bg-red-500'
    WHEN LOWER(name) LIKE '%photo%' OR LOWER(name) LIKE '%image%' OR LOWER(name) LIKE '%picture%' THEN 'bg-pink-500'
    WHEN LOWER(name) LIKE '%game%' OR LOWER(name) LIKE '%gaming%' OR LOWER(name) LIKE '%play%' THEN 'bg-orange-500'
    WHEN LOWER(name) LIKE '%book%' OR LOWER(name) LIKE '%reading%' OR LOWER(name) LIKE '%novel%' THEN 'bg-blue-500'
    WHEN LOWER(name) LIKE '%art%' OR LOWER(name) LIKE '%creative%' OR LOWER(name) LIKE '%drawing%' THEN 'bg-pink-500'
    
    -- Communication/Social related
    WHEN LOWER(name) LIKE '%social%' OR LOWER(name) LIKE '%network%' OR LOWER(name) LIKE '%connect%' THEN 'bg-blue-500'
    WHEN LOWER(name) LIKE '%email%' OR LOWER(name) LIKE '%mail%' OR LOWER(name) LIKE '%message%' THEN 'bg-cyan-500'
    WHEN LOWER(name) LIKE '%phone%' OR LOWER(name) LIKE '%call%' OR LOWER(name) LIKE '%contact%' THEN 'bg-green-500'
    WHEN LOWER(name) LIKE '%chat%' OR LOWER(name) LIKE '%conversation%' THEN 'bg-purple-500'
    WHEN LOWER(name) LIKE '%linkedin%' THEN 'bg-blue-500'
    WHEN LOWER(name) LIKE '%github%' THEN 'bg-slate-500'
    WHEN LOWER(name) LIKE '%twitter%' OR LOWER(name) LIKE '%x%' THEN 'bg-cyan-500'
    
    -- Finance/Investment related
    WHEN LOWER(name) LIKE '%investment%' OR LOWER(name) LIKE '%stock%' OR LOWER(name) LIKE '%trading%' THEN 'bg-green-500'
    WHEN LOWER(name) LIKE '%bank%' OR LOWER(name) LIKE '%account%' OR LOWER(name) LIKE '%saving%' THEN 'bg-green-500'
    WHEN LOWER(name) LIKE '%expense%' OR LOWER(name) LIKE '%cost%' OR LOWER(name) LIKE '%spending%' THEN 'bg-red-500'
    
    -- Default colors for other cases
    ELSE 'bg-blue-500'
END
WHERE color = 'bg-gray-500';

-- Add comment to document the update
COMMENT ON COLUMN custom_folders.color IS 'CSS color class for the folder (e.g., bg-blue-500, bg-green-500, bg-pink-500)';
