import Link from './Link'
import Image from './Image'
import { CreditItemProps } from './CreditItem'

const Credits = () => {
  // Supporters

  const ryanWrights = '/img/supporters/ryan_wright.jpeg'
  const shanBelew = '/img/supporters/shan_belew.jpeg'
  const chief = '/img/supporters/chief.jpeg'
  const finitemaz = '/img/supporters/finitemaz.jpeg'
  const lukeWright = '/img/supporters/luke_wright.jpeg'
  const johnez = '/img/supporters/johnez.png'
  const anml = '/img/supporters/anml.jpeg'
  const kyle = '/img/supporters/kyle.jpeg'
  const cryptofreeze = '/img/supporters/cryptofreeze.png'
  const SadFrogLTC = '/img/supporters/SadFrogLTC.jpeg'
  const _CLINTWESTWOOD_ = '/img/supporters/_CLINTWESTWOOD_.jpeg'
  const ROWEBOT3339 = '/img/supporters/ROWEBOT3339.jpeg'
  const TheLucifers_Son = '/img/supporters/TheLucifers_Son.jpeg'

  const supporters: CreditItemProps[] = [
    {
      link: 'https://twitter.com/ryanwrights',
      image: ryanWrights,
      nym: 'Ryan Wright',
    },
    {
      link: 'https://twitter.com/masterbtcltc',
      image: shanBelew,
      nym: 'Shan Belew',
    },
    {
      link: 'https://twitter.com/ChiefLitecoin',
      image: chief,
      nym: 'CHIEF',
    },
    {
      link: 'https://twitter.com/finitemaz',
      image: finitemaz,
      nym: 'finitemaz',
    },
    {
      link: 'https://twitter.com/lukewrightmain',
      image: lukeWright,
      nym: 'Luke Wright',
    },
    {
      link: 'https://twitter.com/johnez_ltc',
      image: johnez,
      nym: 'Johnez',
    },
    {
      link: 'https://twitter.com/anml_litecoin',
      image: anml,
      nym: 'Anml',
    },
    {
      link: 'https://twitter.com/nakamoto_std',
      image: kyle,
      nym: 'Kyle',
    },
    {
      link: 'https://twitter.com/FreezeMatthew',
      image: cryptofreeze,
      nym: 'cryptofreeze',
    },
    {
      link: 'https://twitter.com/SadFrogLTC',
      image: SadFrogLTC,
      nym: 'SadFrogLTC',
    },
    {
      link: 'https://twitter.com/_CLINTWESTWOOD_',
      image: _CLINTWESTWOOD_,
      nym: 'CLINT WESTWOOD',
    },
    {
      link: 'https://twitter.com/ROWEBOT3339',
      image: ROWEBOT3339,
      nym: 'ROWEBOT',
    },
    {
      link: 'https://twitter.com/TheLucifers_Son',
      image: TheLucifers_Son,
      nym: 'Son of Lucifer',
    },
  ]

  return (
    <div className="col-span-2 col-start-2 grid grid-cols-2 space-y-2 sm:gap-x-2 md:grid-cols-3 md:gap-x-8">
      {supporters
        .filter((s) => s.person)
        .map((s, i) => (
          <div className="items-left flex flex-col space-x-2 pt-8" key={i}>
            <Link href={s.link}>
              <Image
                src={s.image}
                alt={s.nym}
                width={120}
                height={120}
                className="h-36 w-36 rounded-full"
              />
            </Link>
          </div>
        ))}
      {supporters
        .filter((s) => !s.person)
        .map((s, i) => (
          <div className="items-left flex flex-col space-x-2 pt-8" key={i}>
            <Link href={s.link}>
              <Image
                src={s.image}
                alt={s.nym}
                width={120}
                height={120}
                className="h-36 w-36 rounded-full"
              />
            </Link>
          </div>
        ))}
    </div>
  )
}

export default Credits
