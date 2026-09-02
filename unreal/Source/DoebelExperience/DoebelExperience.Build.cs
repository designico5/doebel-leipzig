using UnrealBuildTool;

public class DoebelExperience : ModuleRules
{
    public DoebelExperience(ReadOnlyTargetRules Target) : base(Target)
    {
        PCHUsage = PCHUsageMode.UseExplicitOrSharedPCHs;
        PublicDependencyModuleNames.AddRange(new[]
        {
            "Core",
            "CoreUObject",
            "Engine",
            "InputCore",
            "Json",
            "LevelSequence",
            "MovieScene",
            "Niagara"
        });
    }
}
