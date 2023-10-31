import {json, redirect} from '@shopify/remix-oxygen';

/**
 * @type {V2_MetaFunction}
 */
export const meta = () => {
  return [{title: 'Logout'}];
};

export async function loader() {
  return redirect('/account/login');
}

/**
 * @param {ActionArgs}
 */
export async function action({request, context}) {
  const {session} = context;
  session.unset('customerAccessToken');

  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  return redirect('/', {
    headers: {
      'Set-Cookie': await session.commit(),
    },
  });
}

export default function Logout() {
  return null;
}

/** @typedef {import('@shopify/remix-oxygen').ActionArgs} ActionArgs */
/** @template T @typedef {import('@remix-run/react').V2_MetaFunction<T>} V2_MetaFunction */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof action>} ActionReturnData */
