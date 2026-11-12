# Plato source

The portal is one HTML page, built from these files.

    cd portal-src
    python3 build.py        # writes ../site/portal/app/index.html
    node --check all.js     # optional syntax check

Edit the source files here, run the build, commit both, and push. Netlify deploys on every push to `main`.
Files load in the order listed in `build.py`; later `*12.js` files override earlier ones.
