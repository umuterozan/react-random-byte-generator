import { Button } from "@/components/ui/button"
import { Input } from "./components/ui/input"
import { Label } from "@radix-ui/react-label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { useRef, useState } from "react"

export default function App() {
  const inputRef = useRef(null)
  const radioRef = useRef(null)
  const resultRef = useRef(null)
  const [generatedBytes, setGeneratedBytes] = useState<string | null>(null)
  const { toast } = useToast()

  const submitForm = () => {
    // @ts-ignore
    let numberBytes: any = Number(inputRef.current.value)
    let numberSystem: any;

    // @ts-ignore
    for (const children of radioRef.current.children) {
      if(children.children[0].ariaChecked === "true") {
        numberSystem = children.children[0].value
        break;
      }
    }

    let randomBytes = new Uint8Array(numberBytes)
    randomBytes = crypto.getRandomValues(randomBytes)
    console.log(randomBytes)

    let result: any;
    switch (numberSystem) {
      case "hex":
        result = Array.from(randomBytes)
          .map((byte) => byte.toString(16).padStart(2, "0"))
          .join("");
      break;
      case "base64":
        result = btoa(String.fromCharCode.apply(null, randomBytes as any));
        break;
      case "binary":
        result = randomBytes.reduce(
          (binary, byte) => binary + byte.toString(2).padStart(8, "0"),
          ""
        );
        break;
      default:
        result = "Invalid Format";
        break;
    }


    setGeneratedBytes(result)
  }

  const resetForm = () => {
    // @ts-ignore
    inputRef.current.value = 10
    // @ts-ignore
    resultRef.current.value = ""
  }

  const copyText = (e: any) => {
    // @ts-ignore
    navigator.clipboard.writeText(resultRef.current.value)
    toast({
      title: "Successful",
      description: `Succesfully copied to clipboard.`,
    })
    e.target.innerText = "Copied ✅"
    setTimeout(() => {
      e.target.innerText = "Copy Text"
    }, 1000)
  }

  return (
    <>
      <Toaster />
      <div className="container mx-auto pt-6 flex justify-center h-screen bg-slate-100">
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
            Random Byte Generator
          </h1>
          <p className="leading-7 [&:not(:first-child)]:mt-6">This form allows you to generate random bytes. These bytes can be used for environment variables such as JWT Secret Token.</p>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-6">
            Part 1: Required Fields
          </h3>
          <div className="grid w-full max-w-sm items-center gap-1.5 mt-6">
            <Label htmlFor="byte">Number of Bytes (max: 65536)</Label>
            <Input ref={inputRef} type="number" id="byte" placeholder="Number of bytes" defaultValue={10} required />
          </div>
          <div className="mt-6">
            <Label htmlFor="radio-group">How do you want your bytes displayed?</Label>
            <RadioGroup ref={radioRef} defaultValue="hex" id="radio-group" className="mt-2" required>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hex" id="r1" />
                <Label htmlFor="r1">Hexadecimal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="base64" id="r2" />
                <Label htmlFor="r2">Base 64</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="binary" id="r4" />
                <Label htmlFor="r4">Binary</Label>
              </div>
            </RadioGroup>
          </div>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-6">
            Part 2: Go!
          </h3>
          <div className="flex items-center gap-x-2 mt-2">
            <Button onClick={submitForm}>Get Bytes</Button>
            <Button onClick={resetForm} variant="secondary">Reset Form</Button>
          </div>
          <div className="mt-6 pb-6 grid w-full gap-1.5">
            <Label htmlFor="result">Your result</Label>
            <Textarea ref={resultRef} placeholder="Result is here." id="result" value={generatedBytes as string} />
            <Button onClick={copyText} className="mt-2">Copy Text</Button>
          </div>
        </div>
      </div>
    </>
  )
}