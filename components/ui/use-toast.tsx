// Se este arquivo não existir, crie-o
"use client"

import { createContext, useContext } from "react"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

type ToastContextType = {
  toast: (props: ToastProps) => void
}

const ToastContext = createContext<ToastContextType>({
  toast: () => console.log("Toast não implementado"),
})

export const useToast = () => useContext(ToastContext)

export function toast(props: ToastProps) {
  console.log(`Toast: ${props.title} - ${props.description}`)
  // Em uma implementação real, isso mostraria um toast na UI
  // Como estamos apenas adicionando logs para depuração, vamos apenas logar
  alert(`${props.title}: ${props.description}`)
}

