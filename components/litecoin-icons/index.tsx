import CoinWhite from './coin-white.svg'
import CoinBlue from './coin-blue.svg'

const components = {
  coinBlue: CoinBlue,
  coinWhite: CoinWhite,
}

const LitecoinIcon = ({ kind, size = 10 }) => {
  const LitecoinSVG = components[kind]

  return (
    <div>
      <span className="sr-only">{kind}</span>
      <LitecoinSVG
        className={`fill-current text-gray-100  dark:text-gray-200 h-${size} w-${size}`}
      />
    </div>
  )
}

export default LitecoinIcon
