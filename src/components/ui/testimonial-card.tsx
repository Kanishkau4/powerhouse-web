import { cn } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export interface TestimonialAuthor {
    name: string
    handle: string
    avatar: string
}

export interface TestimonialCardProps {
    author: TestimonialAuthor
    text: string
    href?: string
    className?: string
}

export function TestimonialCard({
    author,
    text,
    href,
    className
}: TestimonialCardProps) {
    const Card = href ? 'a' : 'div'

    return (
        <Card
            {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : {})}
            className={cn(
                "flex flex-col rounded-2xl",
                "bg-gradient-to-b from-white/10 to-white/5",
                "border border-white/10",
                "p-5 sm:p-6 text-start",
                "hover:from-white/15 hover:to-white/10",
                "hover:border-green-500/30",
                "max-w-[320px] sm:max-w-[350px]",
                "transition-all duration-300",
                "backdrop-blur-sm",
                className
            )}
        >
            <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-white/20">
                    <AvatarImage src={author.avatar} alt={author.name} />
                    <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                    <h3 className="text-base font-semibold leading-none text-white">
                        {author.name}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                        {author.handle}
                    </p>
                </div>
            </div>
            <p className="mt-4 text-sm sm:text-base text-gray-300 leading-relaxed">
                {text}
            </p>
        </Card>
    )
}