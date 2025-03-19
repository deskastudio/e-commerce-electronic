import { Phone, Mail } from "lucide-react"

export default function ContactInfo() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Phone className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold">Call To Us</h2>
        </div>
        <div className="space-y-2 pl-12">
          <p className="text-muted-foreground">We are available 24/7, 7 days a week.</p>
          <p className="font-medium">Phone: +880161112222</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Mail className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold">Write To US</h2>
        </div>
        <div className="space-y-2 pl-12">
          <p className="text-muted-foreground">Fill out our form and we will contact you within 24 hours.</p>
          <p className="font-medium">Emails: customer@exclusive.com</p>
          <p className="font-medium">Emails: support@exclusive.com</p>
        </div>
      </div>
    </div>
  )
}

