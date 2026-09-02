#include "ExperienceController.h"

#include "Json.h"
#include "Kismet/KismetMaterialLibrary.h"
#include "LevelSequenceActor.h"
#include "LevelSequencePlayer.h"
#include "NiagaraComponent.h"

AExperienceController::AExperienceController()
{
    PrimaryActorTick.bCanEverTick = true;
}

void AExperienceController::BeginPlay()
{
    Super::BeginPlay();
    TargetState = CurrentState;
}

void AExperienceController::Tick(float DeltaSeconds)
{
    Super::Tick(DeltaSeconds);
    UpdateRenderState(DeltaSeconds);
}

bool AExperienceController::ApplyExperienceState(const FDoebelExperienceState& IncomingState)
{
    if (IncomingState.Version != 1 || IncomingState.Sequence <= LastAcceptedSequence)
    {
        return false;
    }

    LastAcceptedSequence = IncomingState.Sequence;
    TargetState = IncomingState;
    TargetState.Progress = FMath::Clamp(TargetState.Progress, 0.0f, 1.0f);
    TargetState.Velocity = FMath::Clamp(TargetState.Velocity, 0.0f, 1.0f);
    TargetState.Pointer.X = FMath::Clamp(TargetState.Pointer.X, 0.0, 1.0);
    TargetState.Pointer.Y = FMath::Clamp(TargetState.Pointer.Y, 0.0, 1.0);

    if (TargetState.bReducedMotion)
    {
        CurrentState = TargetState;
        UpdateRenderState(0.0f);
    }
    return true;
}

bool AExperienceController::ApplyExperienceStateJson(const FString& JsonPayload)
{
    TSharedPtr<FJsonObject> RootObject;
    const TSharedRef<TJsonReader<>> Reader = TJsonReaderFactory<>::Create(JsonPayload);
    if (!FJsonSerializer::Deserialize(Reader, RootObject) || !RootObject.IsValid())
    {
        return false;
    }

    FString Type;
    double Number = 0.0;
    if (!RootObject->TryGetStringField(TEXT("type"), Type) || Type != TEXT("experience.state"))
    {
        return false;
    }

    FDoebelExperienceState Parsed;
    if (RootObject->TryGetNumberField(TEXT("version"), Number)) Parsed.Version = static_cast<int32>(Number);
    if (RootObject->TryGetNumberField(TEXT("sequence"), Number)) Parsed.Sequence = static_cast<int64>(Number);
    if (RootObject->TryGetNumberField(TEXT("progress"), Number)) Parsed.Progress = static_cast<float>(Number);
    if (RootObject->TryGetNumberField(TEXT("velocity"), Number)) Parsed.Velocity = static_cast<float>(Number);
    RootObject->TryGetBoolField(TEXT("reducedMotion"), Parsed.bReducedMotion);

    FString Value;
    if (RootObject->TryGetStringField(TEXT("chapter"), Value)) Parsed.Chapter = ParseChapter(Value);
    if (RootObject->TryGetStringField(TEXT("variant"), Value)) Parsed.Variant = ParseVariant(Value);
    if (RootObject->TryGetStringField(TEXT("qualityTier"), Value)) Parsed.QualityTier = ParseQuality(Value);

    const TSharedPtr<FJsonObject>* PointerObject = nullptr;
    if (RootObject->TryGetObjectField(TEXT("pointer"), PointerObject) && PointerObject && PointerObject->IsValid())
    {
        if ((*PointerObject)->TryGetNumberField(TEXT("x"), Number)) Parsed.Pointer.X = Number;
        if ((*PointerObject)->TryGetNumberField(TEXT("y"), Number)) Parsed.Pointer.Y = Number;
    }
    return ApplyExperienceState(Parsed);
}

void AExperienceController::UpdateRenderState(float DeltaSeconds)
{
    if (!CurrentState.bReducedMotion)
    {
        CurrentState.Progress = FMath::FInterpTo(CurrentState.Progress, TargetState.Progress, DeltaSeconds, CameraDamping);
        CurrentState.Velocity = FMath::FInterpTo(CurrentState.Velocity, TargetState.Velocity, DeltaSeconds, CameraDamping * 1.5f);
        CurrentState.Pointer = FMath::Vector2DInterpTo(CurrentState.Pointer, TargetState.Pointer, DeltaSeconds, CameraDamping);
        CurrentState.Sequence = TargetState.Sequence;
        CurrentState.Chapter = TargetState.Chapter;
        CurrentState.Variant = TargetState.Variant;
        CurrentState.QualityTier = TargetState.QualityTier;
    }

    if (SequenceActor && SequenceActor->GetSequencePlayer())
    {
        ULevelSequencePlayer* Player = SequenceActor->GetSequencePlayer();
        const double DurationFrames = Player->GetDuration().Time.AsDecimal();
        const FFrameTime TargetFrame = FFrameTime::FromDecimal(DurationFrames * CurrentState.Progress);
        Player->SetPlaybackPosition(FMovieSceneSequencePlaybackParams(TargetFrame, EUpdatePositionMethod::Jump));
    }

    if (MaterialParameters)
    {
        UKismetMaterialLibrary::SetScalarParameterValue(GetWorld(), MaterialParameters, TEXT("ScrollProgress"), CurrentState.Progress);
        UKismetMaterialLibrary::SetScalarParameterValue(GetWorld(), MaterialParameters, TEXT("ScrollVelocity"), CurrentState.Velocity);
        UKismetMaterialLibrary::SetScalarParameterValue(GetWorld(), MaterialParameters, TEXT("ReducedMotion"), CurrentState.bReducedMotion ? 1.0f : 0.0f);
    }

    if (PhaseSystem)
    {
        PhaseSystem->SetVariableFloat(TEXT("User.ScrollProgress"), CurrentState.Progress);
        PhaseSystem->SetVariableFloat(TEXT("User.ScrollVelocity"), CurrentState.Velocity);
        PhaseSystem->SetPaused(CurrentState.bReducedMotion);
    }
}

EDoebelChapter AExperienceController::ParseChapter(const FString& Value)
{
    if (Value == TEXT("DISCOVERY")) return EDoebelChapter::Discovery;
    if (Value == TEXT("APPROACH")) return EDoebelChapter::Approach;
    if (Value == TEXT("TRANSFORM")) return EDoebelChapter::Transform;
    if (Value == TEXT("DEEP")) return EDoebelChapter::Deep;
    if (Value == TEXT("CONTEXT")) return EDoebelChapter::Context;
    if (Value == TEXT("PROOF")) return EDoebelChapter::Proof;
    if (Value == TEXT("REBUILD")) return EDoebelChapter::Rebuild;
    if (Value == TEXT("CTA")) return EDoebelChapter::Cta;
    return EDoebelChapter::Intro;
}

EDoebelVariant AExperienceController::ParseVariant(const FString& Value)
{
    if (Value == TEXT("PHASE")) return EDoebelVariant::Phase;
    if (Value == TEXT("CINE")) return EDoebelVariant::Cine;
    return EDoebelVariant::Flow;
}

EDoebelQualityTier AExperienceController::ParseQuality(const FString& Value)
{
    if (Value == TEXT("ULTRA")) return EDoebelQualityTier::Ultra;
    if (Value == TEXT("HIGH")) return EDoebelQualityTier::High;
    if (Value == TEXT("FALLBACK")) return EDoebelQualityTier::Fallback;
    return EDoebelQualityTier::Balanced;
}
