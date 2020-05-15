module.exports = {
  'GET /api/user/roles': function(req, res) {
    res.json({
      code: 0,
      object: {
        recruit: true,
        coach: true,
        mentor: true,
        scc: true,
        bp: true,
        'bp-assistant': true,
        super: true
      }
    });
  },
};
