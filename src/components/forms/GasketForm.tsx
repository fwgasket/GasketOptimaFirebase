import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import useQuoteStore from "@/store/quoteStore"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const gasketFormSchema = z
  .object({
    quantity: z.number().min(1, { message: "Quantity is required" }),
    shape: z.enum(["rectangle", "circle"]),
    width: z.number().optional(),
    height: z.number().optional(),
    diameter: z.number().optional(),
    innerDiameter: z.number().optional(),
    boltHoles: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.shape === "rectangle") {
      if (!data.width) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["width"],
          message: "Width is required for a rectangle",
        });
      }
      if (!data.height) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["height"],
          message: "Height is required for a rectangle",
        });
      }
    }
    if (data.shape === "circle") {
      if (!data.diameter) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["diameter"],
          message: "Diameter is required for a circle",
        });
      }
    }
  });


type GasketFormValues = z.infer<typeof gasketFormSchema>

function GasketForm() {
  const addGasket = useQuoteStore((state) => state.addGasket)
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<GasketFormValues>({
    resolver: zodResolver(gasketFormSchema),
    defaultValues: {
      shape: "rectangle",
    },
  })

  const shape = watch("shape")

  const onSubmit = (data: GasketFormValues) => {
    addGasket(data)
    reset()
  }

  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-xl font-bold mb-4">Gasket Details</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input id="quantity" type="number" {...register("quantity", { valueAsNumber: true })} />
          {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}
        </div>

        <div>
            <Label>Shape</Label>
            <Controller
                control={control}
                name="shape"
                render={({ field }) => (
                    <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                    >
                        <div className="flex items-center space-x-2">
                        <RadioGroupItem value="rectangle" id="rectangle" />
                        <Label htmlFor="rectangle">Rectangle</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                        <RadioGroupItem value="circle" id="circle" />
                        <Label htmlFor="circle">Circle</Label>
                        </div>
                    </RadioGroup>
                )}
            />
        </div>

        {shape === "rectangle" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="width">Width</Label>
              <Input id="width" type="number" {...register("width", { valueAsNumber: true })} />
              {errors.width && <p className="text-red-500 text-sm">{errors.width.message}</p>}
            </div>
            <div>
              <Label htmlFor="height">Height</Label>
              <Input id="height" type="number" {...register("height", { valueAsNumber: true })} />
              {errors.height && <p className="text-red-500 text-sm">{errors.height.message}</p>}
            </div>
          </div>
        )}

        {shape === "circle" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="diameter">Diameter</Label>
              <Input id="diameter" type="number" {...register("diameter", { valueAsNumber: true })} />
              {errors.diameter && <p className="text-red-500 text-sm">{errors.diameter.message}</p>}
            </div>
            <div>
              <Label htmlFor="innerDiameter">Inner Diameter</Label>
              <Input id="innerDiameter" type="number" {...register("innerDiameter", { valueAsNumber: true })} />
            </div>
             <div>
              <Label htmlFor="boltHoles">Bolt Holes</Label>
              <Input id="boltHoles" type="number" {...register("boltHoles", { valueAsNumber: true })} />
            </div>
          </div>
        )}

        <Button type="submit" className="mt-4">Add Gasket</Button>
      </form>
    </div>
  )
}

export default GasketForm
