import React from 'react';
import { Link } from 'react-router-dom';

export default function SigninScreen() {
  return (
    <div>
      <h1>Sign In</h1>
      <p>
        ¿Todavía no tienes cuenta? Pincha <Link to="/signup">aquí</Link>
      </p>
    </div>
  );
}
