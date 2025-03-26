const HeaderBox = ({type='title', title, user, subtitle}: HeaderBoxProps) => {
  return (
    <div className="header-box">
      <h1 className="header-box-title">
        {title}
        {type === 'greeting' && (
          <span className="text-blue-500">
            &nbsp;{user}
          </span>
        )}
      </h1>
      <p className="header-box-subtext">
        {subtitle}  
      </p>
    </div>
  )
}

export default HeaderBox