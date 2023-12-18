
module.exports = Object.freeze({
    API : {
        BASE_URL : "https://b79b-160-75-194-35.ngrok-free.app/",
        SKIP_BROWSER_WARNING : {
            'ngrok-skip-browser-warning': 1,
        },
    },

    MODAL_BODY_TYPES : {
        USER_DETAIL : "USER_DETAIL",
        PLAYER_ADD_NEW : "PLAYER_ADD_NEW",
        PLAYER_EDIT : "PLAYER_EDIT",
        MATCH_ADD_NEW : "MATCH_ADD_NEW",
        MATCH_EDIT : "MATCH_EDIT",
        TEAM_ADD_NEW : "TEAM_ADD_NEW",
        TEAM_EDIT : "TEAM_EDIT",
        LEAGUE_ADD_NEW : "LEAGUE_ADD_NEW",
        LEAGUE_EDIT : "LEAGUE_EDIT",
        STADIUM_ADD_NEW : "STADIUM_ADD_NEW",
        STADIUM_EDIT : "STADIUM_EDIT",
        CONFIRMATION : "CONFIRMATION",
        DEFAULT : "",
    },

    CONFIRMATION_MODAL_CLOSE_TYPES : {
        TEAM_DELETE  : "TEAM_DELETE",
        STADIUM_DELETE  : "STADIUM_DELETE",
        MATCH_DELETE  : "MATCH_DELETE",
        LEAGUE_DELETE : "LEAGUE_DELETE",
        PLAYER_DELETE : "PLAYER_DELETE",
    },
});
