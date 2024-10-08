import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import TreblySuccess from "../DepositSuccess"
import TrebolIcon from "../ui/logo"

interface TreblyDepositProps {
  balance: number
  onDeposit: (amount: number) => Promise<void>
  onBack: () => void
}

export default function TreblyDeposit({ balance, onDeposit, onBack }: TreblyDepositProps) {
  const [depositAmount, setDepositAmount] = useState("")
  const [isDepositing, setIsDepositing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleMaxClick = () => {
    setDepositAmount(balance.toString())
  }

  const handleDepositClick = async () => {
    const amount = parseFloat(depositAmount)
    if (isNaN(amount) || amount <= 0 || amount > balance) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to deposit.",
        variant: "destructive",
      })
      return
    }

    setIsDepositing(true)
    try {
      await onDeposit(amount)
      setShowSuccess(true)
    } catch (error) {
      toast({
        title: "Deposit failed",
        description: "There was an error processing your deposit. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDepositing(false)
    }
  }

  if (showSuccess) {
    return <TreblySuccess onContinue={onBack} />
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white p-4">
      <header className="flex items-center mb-8">
        <Button variant="ghost" size="icon" className="text-green-500" aria-label="Go back" onClick={onBack}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <TrebolIcon />
          <h1 className="text-2xl font-bold">Trebly</h1>
        </div>

        <div className="w-full max-w-md space-y-6">
          <h2 className="text-2xl font-semibold text-center">
            How much WLD<br />do you want to deposit?
          </h2>

          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-gray-900 rounded-full"></div>
              </div>
            </div>
            <Input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full pl-12 pr-24 py-6 bg-gray-800 border-green-500 rounded-full text-xl"
              placeholder="0 WLD"
              min="0"
              max={balance}
              step="0.01"
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <Button 
                className="h-full px-6 rounded-r-full bg-green-500 text-gray-900 hover:bg-green-600"
                onClick={handleMaxClick}
              >
                MAX
              </Button>
            </div>
          </div>

          <div className="text-center text-gray-400">
            Balance: {balance} WLD
          </div>

          <Button 
            className="w-full py-6 text-xl bg-green-500 text-gray-900 rounded-full hover:bg-green-600"
            onClick={handleDepositClick}
            disabled={isDepositing}
          >
            {isDepositing ? "Depositing..." : "Deposit"}
          </Button>
        </div>
      </main>
    </div>
  )
}