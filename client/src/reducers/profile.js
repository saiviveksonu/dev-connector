import { GET_PROFILE, PROFILE_ERROR ,PROFILE_CLEAR,UPDATE_PROFILE,GET_PROFILES} from "../actions/type";
const initialstate = {
    // profile will hold the data of user when loged in
    profile: null,
    // list of profiles are stored in profiles
    profiles: [],
    loading: true,
    error: {}
}
export default function (state = initialstate, action) {
    const { type, payload } = action;
    switch (type) {
        case UPDATE_PROFILE:
            return {
                ...state,
                profile: payload,
                loading: false
              };
        // state of the profile
        case GET_PROFILE:
            return {
                ...state,
                profile: payload,
                loading: false,
            };
            case GET_PROFILES:
                return {
                  ...state,
                  profiles: payload,
                  loading: false
                };
        case PROFILE_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            };
            case PROFILE_CLEAR:
                return{
                    ...state,
                    profile:null,
                    loading:false
                }
        default:
            return state;
    }
}