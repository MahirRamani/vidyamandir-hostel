"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface Step {
  id: string
  title: string
  description?: string
  component: React.ComponentType<any>
}

interface MultiStepFormProps {
  steps: Step[]
  onComplete: (data: any) => void
  className?: string
}

export function MultiStepForm({ steps, onComplete, className }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = (stepData: any) => {
    const newFormData = { ...formData, [steps[currentStep].id]: stepData }
    setFormData(newFormData)

    if (currentStep === steps.length - 1) {
      handleSubmit(newFormData)
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      await onComplete(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  const CurrentStepComponent = steps[currentStep].component

  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{steps[currentStep].title}</CardTitle>
                {steps[currentStep].description && (
                  <p className="text-sm text-muted-foreground mt-1">{steps[currentStep].description}</p>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </CardHeader>
        <CardContent>
          <CurrentStepComponent
            initialData={formData[steps[currentStep].id]}
            onNext={handleNext}
            onPrevious={currentStep > 0 ? handlePrevious : undefined}
            isSubmitting={isSubmitting}
            isLastStep={currentStep === steps.length - 1}
          />
        </CardContent>
      </Card>
    </div>
  )
}
