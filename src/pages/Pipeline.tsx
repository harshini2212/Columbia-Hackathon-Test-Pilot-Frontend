import { useState } from "react";
import Navbar from "@/components/Navbar";
import PipelineSidebar from "@/components/pipeline/PipelineSidebar";
import PipelineStepper from "@/components/pipeline/PipelineStepper";
import StepContent from "@/components/pipeline/StepContent";

const Pipeline = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const handleStepComplete = () => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      next.add(currentStep);
      return next;
    });
    if (currentStep < 10) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex pt-16">
        <PipelineSidebar
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={handleStepClick}
        />
        <main className="flex-1 min-w-0">
          <div className="border-b border-border px-8 py-4">
            <PipelineStepper
              currentStep={currentStep}
              completedSteps={completedSteps}
              onStepClick={handleStepClick}
            />
          </div>
          <div className="p-8 max-w-4xl">
            <StepContent
              stepIndex={currentStep}
              onComplete={handleStepComplete}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Pipeline;
