using UnrealBuildTool;
using System.Collections.Generic;

public class DoebelExperienceTarget : TargetRules
{
    public DoebelExperienceTarget(TargetInfo Target) : base(Target)
    {
        Type = TargetType.Game;
        DefaultBuildSettings = BuildSettingsVersion.Latest;
        IncludeOrderVersion = EngineIncludeOrderVersion.Latest;
        ExtraModuleNames.Add("DoebelExperience");
    }
}
