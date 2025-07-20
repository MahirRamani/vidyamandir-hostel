"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { healthInfoSchema } from "@/lib/validations/student"
import type { z } from "zod"
import { useState } from "react"
import { Plus, X } from "lucide-react"

type HealthInfoFormData = z.infer<typeof healthInfoSchema>

interface HealthInfoFormProps {
  initialData?: Partial<HealthInfoFormData>
  onNext: (data: HealthInfoFormData) => void
  onPrevious?: () => void
  isSubmitting?: boolean
  isLastStep?: boolean
}

export function HealthInfoForm({ initialData, onNext, onPrevious, isSubmitting, isLastStep }: HealthInfoFormProps) {
  const [illnesses, setIllnesses] = useState<string[]>(initialData?.illnesses || [])
  const [allergies, setAllergies] = useState<string[]>(initialData?.allergies || [])

  const form = useForm<HealthInfoFormData>({
    resolver: zodResolver(healthInfoSchema),
    defaultValues: {
      bloodGroup: initialData?.bloodGroup || undefined,
      illnesses: initialData?.illnesses || [],
      allergies: initialData?.allergies || [],
    },
  })

  const addArrayItem = (type: "illnesses" | "allergies", value: string) => {
    if (!value.trim()) return

    const currentArray = type === "illnesses" ? illnesses : allergies
    const setArray = type === "illnesses" ? setIllnesses : setAllergies

    if (!currentArray.includes(value.trim())) {
      const newArray = [...currentArray, value.trim()]
      setArray(newArray)
      form.setValue(type, newArray)
    }
  }

  const removeArrayItem = (type: "illnesses" | "allergies", index: number) => {
    const currentArray = type === "illnesses" ? illnesses : allergies
    const setArray = type === "illnesses" ? setIllnesses : setAllergies

    const newArray = currentArray.filter((_, i) => i !== index)
    setArray(newArray)
    form.setValue(type, newArray)
  }

  const onSubmit = (data: HealthInfoFormData) => {
    onNext({ ...data, illnesses, allergies })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Blood Group */}
        <FormField
          control={form.control}
          name="bloodGroup"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Blood Group</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Illnesses */}
        <div className="space-y-2">
          <Label>Illnesses</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Add illness"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addArrayItem("illnesses", e.currentTarget.value)
                  e.currentTarget.value = ""
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement
                addArrayItem("illnesses", input.value)
                input.value = ""
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {illnesses.map((illness, index) => (
              <div key={index} className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md text-sm">
                {illness}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0"
                  onClick={() => removeArrayItem("illnesses", index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Allergies */}
        <div className="space-y-2">
          <Label>Allergies</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Add allergy"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addArrayItem("allergies", e.currentTarget.value)
                  e.currentTarget.value = ""
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement
                addArrayItem("allergies", input.value)
                input.value = ""
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {allergies.map((allergy, index) => (
              <div key={index} className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md text-sm">
                {allergy}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0"
                  onClick={() => removeArrayItem("allergies", index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          {onPrevious && (
            <Button type="button" variant="outline" onClick={onPrevious}>
              Previous
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting} className="ml-auto">
            {isLastStep ? "Submit" : "Next"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
