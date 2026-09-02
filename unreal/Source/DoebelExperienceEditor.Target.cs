using UnrealBuildTool;
using System.Collections.Generic;

public class DoebelExperienceEditorTarget : TargetRules
{
    public DoebelExperienceEditorTarget(TargetInfo Target) : base(Target)
    {
        Type = TargetType.Editor;
        DefaultBuildSettings = BuildSettingsVersion.Latest;
        IncludeOrderVersion = EngineIncludeOrderVersion.Latest;
        ExtraModuleNames.Add("DoebelExperience");
    }
}
