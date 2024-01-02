import { useRef } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import logo from "../../assets/social-media-logo.png";
import useClickTracker from "../../shared/useClickTracker";
import ProfileImageWithDefault from "../profile/ProfileImageWithDefault";
const TopBar = (props) => {
  const actionArea = useRef();
  let dropDownVisible = useClickTracker(actionArea);

  const onClickLogout = () => {
    const action = {
      type: "LOGOUT_SUCCESS",
    };
    props.dispatch(action);
  };

  let links = (
    <ul className="nav navbar-nav ms-auto">
      <li className="nav-item">
        <Link to="/signup" className="nav-link">
          Sign Up
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/login" className="nav-link">
          Login
        </Link>
      </li>
    </ul>
  );
  if (props.user.isLoggedIn) {
    let dropDownClass = "p-0 shadow dropdown-menu";
    if (dropDownVisible) {
      dropDownClass += " show";
    }
    links = (
      <ul className="nav navbar-nav ms-auto" ref={actionArea}>
        <li className="nav-item dropdown">
          <div className="d-flex" style={{ cursor: "pointer" }}>
            <ProfileImageWithDefault
              className="rounded-circle m-auto"
              width="32"
              height="32"
              image={props.user.image}
            />
            <span className="nav-link dropdown-toggle">
              {props.user.displayName}
            </span>
          </div>
          <div className={dropDownClass} data-testid="drop-down-menu">
            <Link to={`/${props.user.username}`} className="dropdown-item">
              <AiOutlineUser className="mb-1 me-2" size="20" />
              My Profile
            </Link>
            <span
              className="dropdown-item"
              onClick={onClickLogout}
              style={{
                cursor: "pointer",
              }}
            >
              <FiLogOut className="mb-1 me-2" size="20" />
              Logout
            </span>
          </div>
        </li>
      </ul>
    );
  }

  return (
    <div className="bg-white shadow-sm mb-2">
      <div className="container">
        <nav aria-label="nav" className="navbar navbar-light navbar-expand">
          <Link to="/" className="navbar-brand">
            <img
              src={logo}
              width="60"
              alt="Social Media"
              aria-label="social-media"
            />
            Social Media
          </Link>
          {links}
        </nav>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state,
  };
};

export default connect(mapStateToProps)(TopBar);
