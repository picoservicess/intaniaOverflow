# Frontend of Intania Overflow

## Manual Setup

1. Create a `.env.local` file in the root directory.
2. Fill it with the environment variables provided on Discord.
3. Run `npm install` to install all dependencies.
4. Run `npm run dev` to start the website.

---

## Use Cases

### Creating a Thread

1. Log in via Chula SSO (`/login`).
2. Navigate to the home page (`/home`).
3. Click the "สร้างเธรด" button.
4. Fill out the "Create Thread" form.
5. Submit the form.
6. Your thread will immediately appear as the first post on the home page and in your profile.

---

### Replying to a Thread

1. Log in via Chula SSO (`/login`).
2. Navigate to the thread page by clicking the desired thread from the list on the home or profile page.
3. Click the "ตอบกลับ" button.
4. Fill out the "Create Reply" form.
5. Submit the form.
6. Your reply will instantly appear at the top of the replies.

---

### Searching for a Thread

1. Go to the home page (`/home`).
2. Type a keyword in the search bar.
3. Click the search button.

---

### Voting on a Thread

#### Option 1:

1. Log in via Chula SSO (`/login`).
2. Go to the home page (`/home`) or profile page (`/profile`).
3. Click the up or down arrow button on the thread to vote.

#### Option 2:

1. Log in via Chula SSO (`/login`).
2. Navigate to the thread page by clicking the desired thread from the list on the home or profile page.
3. Click the up or down arrow button on the left to vote.

---

### Voting on a Reply

1. Log in via Chula SSO (`/login`).
2. Navigate to the thread page by clicking the desired thread from the list on the home or profile page.
3. Scroll to the reply section.
4. Click the up or down arrow button on the left side of the reply to vote.

---

### Pinning a Thread

#### Option 1:

1. Log in via Chula SSO (`/login`).
2. Navigate to the home or profile page.
3. Click the bookmark button to pin or unpin the thread.
4. Your pinned threads will appear on the profile page.

#### Option 2:

1. Log in via Chula SSO (`/login`).
2. Navigate to the thread page by clicking the desired thread from the list on the home or profile page.
3. Click the bookmark button on the top right to pin or unpin the thread.
4. Your pinned threads will appear on the profile page.

---

### Receiving Thread Notifications

1. Log in via Chula SSO (`/login`).
2. You will receive notifications when:
   - Someone replies to your thread.
   - Someone replies to your pinned thread.
   - Someone updates your pinned thread.
3. Click the bell icon in the header to view notifications.

---

## Additional Use Cases

### Updating a Thread

1. Log in via Chula SSO (`/login`).
2. Navigate to a thread you own by clicking it from the home or profile page.
3. Click the pencil icon on the top right.
4. Fill out the "Update Thread" form.
5. Submit the form.
6. Your content will update within a few seconds.

---

### Updating Your Profile

1. Log in via Chula SSO (`/login`).
2. Go to the profile page.
3. Click the pencil icon at the bottom right of your profile avatar.
4. Fill out the "Update Profile" form.
5. Submit the form.
6. Your profile will update within a few seconds.
