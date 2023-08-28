import Link from './Link'
import Image from './Image'
import CreditItem, { CreditItemProps } from './CreditItem'

const Volunteers = () => {
  const lucas = '/img/volunteers/lucas.jpg'
  const gabe = '/img/volunteers/gabe.jpg'
  const anthony = '/img/advisors/anthony.jpeg'
  const losh = '/img/advisors/losh.jpeg'

  const volunteers: CreditItemProps[] = [
    {
      link: 'https://twitter.com/anthonyonchain',
      image: anthony,
      nym: 'Anthony Gurrera',
    },
    {
      link: 'https://twitter.com/loshan1212',
      image: losh,
      nym: 'Loshan',
    },
  ]

  return (
    <div className="col-span-2 col-start-2 grid grid-cols-2 space-y-2 sm:gap-x-2 md:grid-cols-3 md:gap-x-8">
      {volunteers.map((v, i) => (
        <div className="items-left flex flex-col space-x-2 pt-8" key={i}>
          <Link href={v.link}>
            <Image
              src={v.image}
              alt={v.nym}
              title={v.nym}
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

export default Volunteers
