/* Real text stays real text: each word is a span (class "w") so the scroll
   highlight can fill it; screen readers and crawlers read the sentence. */
export function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\s+)/).map((part, i) =>
        /^\s+$/.test(part) ? (
          part
        ) : (
          <span key={i} className="w">
            {part}
          </span>
        )
      )}
    </>
  )
}
