import React from "react";
import LoginUserApi from "../../api/LoginUser";
import { connect } from "react-redux";
import { setCurrentUser } from "../../redux/user/user.actions";

class SignIn extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
    };
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (event, setCurrentUser) => {
    event.preventDefault();

    const { email, password } = this.state;

    try {
      this.loginUser(email, password, setCurrentUser);
      this.setState({
        email: "",
        password: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  updateUserState = (userToken, userId, setCurrentUser) => {
    // Persist user details to localStorage
    localStorage.setItem(
      "userInfo",
      JSON.stringify({
        userId: userId,
        token: userToken,
      })
    );

    setCurrentUser({
      userId: userId,
      token: userToken,
    });
  };

  loginUser = (email, password, setCurrentUser) => {
    let api = new LoginUserApi(email, password);
    let responsePromise = api.loginUser();

    responsePromise
      .then((res) => {
        return {
          userId: res.headers.userid,
          userToken: res.headers.token,
        };
      })
      .then(({ userId, userToken }) => {
        console.log(userId);
        console.log(userToken);
        this.updateUserState(userToken, userId, setCurrentUser);
      });

    // Now dispatch an action to update the state
  };

  render() {
    return (
      <div>
        <h3>I already have an account</h3>
        <h6>Sign in with your email and password</h6>
        <form onSubmit={(e) => this.handleSubmit(e, this.props.setCurrentUser)}>
          <div className="form-group">
            <label htmlFor="inputEmail">Email address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              id="inputEmail"
              onChange={this.handleChange}
              value={this.state.email}
            />
          </div>
          <div className="form-group">
            <label htmlFor="inputPassword">Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              id="inputPassword"
              value={this.state.password}
              onChange={this.handleChange}
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary">
              Sign In
            </button>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
