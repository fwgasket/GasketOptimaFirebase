import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import useQuoteStore from "@/store/quoteStore"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"

const materialFormSchema = z.object({
    name: z.string().min(1, { message: "Material name is required" }),
    type: z.enum(["sheet", "roll"]),
    length: z.number().optional(),
    width: z.number().optional(),
    cost: z.number(),
    edgeSpacing: z.number(),
    partSpacing: z.number(),
    stocked: z.boolean(),
})

type MaterialFormValues = z.infer<typeof materialFormSchema>

function MaterialForm() {
    const { material, updateMaterial } = useQuoteStore()
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<MaterialFormValues>({
    resolver: zodResolver(materialFormSchema),
    defaultValues: material,
  })

  const type = watch("type")

  const onSubmit = (data: MaterialFormValues) => {
    updateMaterial(data)
  }

  return (
    <div className="p-4 border rounded-md mt-4">
      <h2 className="text-xl font-bold mb-4">Material Details</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
            <Label htmlFor="name">Material Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

         <div>
            <Label>Type</Label>
            <Controller
                control={control}
                name="type"
                render={({ field }) => (
                    <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                    >
                        <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sheet" id="sheet" />
                        <Label htmlFor="sheet">Sheet</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                        <RadioGroupItem value="roll" id="roll" />
                        <Label htmlFor="roll">Roll</Label>
                        </div>
                    </RadioGroup>
                )}
            />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <Label htmlFor="width">Width</Label>
                <Input id="width" type="number" {...register("width", { valueAsNumber: true })} />
            </div>
            {type === "sheet" && (
                <div>
                    <Label htmlFor="length">Length</Label>
                    <Input id="length" type="number" {...register("length", { valueAsNumber: true })} />
                </div>
            )}
             <div>
                <Label htmlFor="cost">Cost</Label>
                <Input id="cost" type="number" {...register("cost", { valueAsNumber: true })} />
            </div>
             <div>
                <Label htmlFor="edgeSpacing">Edge Spacing</Label>
                <Input id="edgeSpacing" type="number" {...register("edgeSpacing", { valueAsNumber: true })} />
            </div>
            <div>
                <Label htmlFor="partSpacing">Part Spacing</Label>
                <Input id="partSpacing" type="number" {...register("partSpacing", { valueAsNumber: true })} />
            </div>
        </div>
        
        <div className="flex items-center space-x-2">
             <Controller
                control={control}
                name="stocked"
                render={({ field }) => (
                    <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                    />
                )}
            />
            <Label htmlFor="stocked">Stocked</Label>
        </div>

        <Button type="submit" className="mt-4">Update Material</Button>
      </form>
    </div>
  )
}

export default MaterialForm
