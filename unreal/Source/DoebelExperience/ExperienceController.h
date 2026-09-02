#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "ExperienceController.generated.h"

class ALevelSequenceActor;
class UMaterialParameterCollection;
class UNiagaraComponent;

UENUM(BlueprintType)
enum class EDoebelChapter : uint8
{
    Intro,
    Discovery,
    Approach,
    Transform,
    Deep,
    Context,
    Proof,
    Rebuild,
    Cta
};

UENUM(BlueprintType)
enum class EDoebelVariant : uint8
{
    Flow,
    Phase,
    Cine
};

UENUM(BlueprintType)
enum class EDoebelQualityTier : uint8
{
    Ultra,
    High,
    Balanced,
    Fallback
};

USTRUCT(BlueprintType)
struct FDoebelExperienceState
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadOnly) int32 Version = 1;
    UPROPERTY(BlueprintReadOnly) int64 Sequence = 0;
    UPROPERTY(BlueprintReadOnly) float Progress = 0.0f;
    UPROPERTY(BlueprintReadOnly) float Velocity = 0.0f;
    UPROPERTY(BlueprintReadOnly) FVector2D Pointer = FVector2D(0.5, 0.5);
    UPROPERTY(BlueprintReadOnly) EDoebelChapter Chapter = EDoebelChapter::Intro;
    UPROPERTY(BlueprintReadOnly) EDoebelVariant Variant = EDoebelVariant::Flow;
    UPROPERTY(BlueprintReadOnly) EDoebelQualityTier QualityTier = EDoebelQualityTier::Balanced;
    UPROPERTY(BlueprintReadOnly) bool bReducedMotion = false;
};

UCLASS(BlueprintType)
class DOEBELEXPERIENCE_API AExperienceController : public AActor
{
    GENERATED_BODY()

public:
    AExperienceController();
    virtual void Tick(float DeltaSeconds) override;

    UFUNCTION(BlueprintCallable, Category="Döbel|Experience")
    bool ApplyExperienceState(const FDoebelExperienceState& IncomingState);

    UFUNCTION(BlueprintCallable, Category="Döbel|Experience")
    bool ApplyExperienceStateJson(const FString& JsonPayload);

    UFUNCTION(BlueprintPure, Category="Döbel|Experience")
    const FDoebelExperienceState& GetCurrentState() const { return CurrentState; }

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Döbel|Experience")
    TObjectPtr<ALevelSequenceActor> SequenceActor;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Döbel|Experience")
    TObjectPtr<UMaterialParameterCollection> MaterialParameters;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Döbel|Experience")
    TObjectPtr<UNiagaraComponent> PhaseSystem;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Döbel|Experience", meta=(ClampMin="0.1"))
    float CameraDamping = 5.0f;

protected:
    virtual void BeginPlay() override;

private:
    void UpdateRenderState(float DeltaSeconds);
    static EDoebelChapter ParseChapter(const FString& Value);
    static EDoebelVariant ParseVariant(const FString& Value);
    static EDoebelQualityTier ParseQuality(const FString& Value);

    UPROPERTY(VisibleAnywhere, Category="Döbel|Experience")
    FDoebelExperienceState CurrentState;

    FDoebelExperienceState TargetState;
    int64 LastAcceptedSequence = -1;
};
