"use client"

import * as React from "react"
import Link from "next/link"
import { animate, motion, useMotionValue, useTransform } from "framer-motion"

interface CountBoxProps {
  name: string
  finalValue: number
  href: string
}

export default function CountBox({ name, finalValue, href }: CountBoxProps) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, Math.round)

  React.useEffect(() => {
    const animation = animate(count, finalValue, { duration: 2 })

    return animation.stop
  }, [count, finalValue])

  return (
    <Link href={href}>
      <div className="bg-primary text-secondary shadow-primary flex h-60 w-60 flex-col items-center justify-center gap-20 rounded font-extrabold shadow-xl dark:shadow-none">
        <h2 className="text-secondary text-center uppercase">{name}</h2>
        <motion.h2 className="text-center text-6xl">{rounded}</motion.h2>
      </div>
    </Link>
  )
}
