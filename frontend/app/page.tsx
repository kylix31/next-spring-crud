import CountBox from "@/components/ui/count-box"
import { backendPath } from "@/components/helpers/database-path"

async function getData(type: "companies" | "supplies") {
  const res = await fetch(`${backendPath()}/${type}`, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("failed to fetch data")
  }

  return res.json()
}

export default async function IndexPage() {
  const suppliesData = await getData("supplies")
  const companiesData = await getData("companies")

  return (
    <section className="container mt-3 flex flex-col items-center justify-center gap-5 sm:mt-0 sm:gap-28">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          A simple crud example with{" "}
          <a className="underline decoration-sky-500/30">NextJS</a>(with the new
          serverside components logic) built with{" "}
          <a className="underline decoration-pink-500/30">Radix UI</a> and{" "}
          <a className="underline decoration-indigo-500/30">Tailwind CSS</a>.
        </h1>
        <p className="text-muted-foreground max-w-[700px] text-lg">
          Powered by Spring Boot and MySQL database.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6">
        <CountBox
          href="/companies"
          name="total companies"
          finalValue={companiesData.length}
        />
        <CountBox
          href="/supplies"
          name="total suppliers"
          finalValue={suppliesData.length}
        />
      </div>
    </section>
  )
}
