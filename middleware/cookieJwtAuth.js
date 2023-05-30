import jwt from 'jsonwebtoken'

export const cookieJwtAuth = (req, res, next) => {
  const token = req.cookies.token

  try {
    const user = jwt.verify(token, procces.env.JWT_STRING)
    req.user = user
    next()
  } catch (error) {
    res.clearCookie('token')
    return res.redirect('/')
  }
}
