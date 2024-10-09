"use client"


export default function ToastDestructive(title: string, description: string, action: string) {
  const { toast } = useToast()

  return (
    <Button
      variant="outline"
      onClick={() => {
        toast({
          variant: "destructive",
          title: title,
          description: description,
          action: <ToastAction altText={action}>{action}</ToastAction>,
        })
      }}
    >
    </Button>
  )
}
