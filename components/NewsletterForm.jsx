'use client'
export default function NewsletterForm() {
  return (
    <form className="flex w-full md:w-auto gap-0" onSubmit={e => e.preventDefault()}>
      <input
        type="email"
        placeholder="Enter your email"
        className="w-full md:w-72 px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white"
      />
      <button
        type="submit"
        className="bg-white hover:bg-white/90 px-6 py-3 text-sm font-medium uppercase tracking-wide transition-colors whitespace-nowrap text-primary-dark"
      >
        Subscribe
      </button>
    </form>
  )
}
