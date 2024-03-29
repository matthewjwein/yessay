
/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/login')
  }
  next()
};


/*
 *  User authorizations routing middleware
 */

exports.user = {
    hasAuthorization : function (req, res, next) {
      if (req.profile.id != req.user.id) {
        return res.redirect('/users/'+req.profile.id)
      }
      next()
    }
}


/*
 *  Essay authorizations routing middleware
 */

exports.essay = {
    hasAuthorization : function (req, res, next) {
      if (req.essay.user.id != req.user.id) {
        return res.redirect('/essays/'+req.essay.id)
      }
      next()
    }
}
