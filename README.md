
# Team ZAJJ | Hack 4 Good 2025

Link to deployment: https://hack4good-khaki.vercel.app/

**Project Scope and Aim:** We aim to create a web application.

This application will not only connect people through sports but also facilitate finding sports buddies to play with. Ultimately, finding like-minded individuals with the same sporting intentions is our key aim.

We look to match people by sporting type through our application and facilitate the coordination of sports meetups with our matched individuals.

**Motivation:** Driven by our passion for sports, we have encountered a common challenge: finding fellow enthusiasts who share our precise sporting passions.

In acknowledging the diverse sports preferences within our social circles, we identified a gap—connecting with individuals eager to engage in the same sport.

Some sports thrive with multiple participants, amplifying the fun, productivity, and effectiveness of the experience. Additionally, considering the fact that different people have varying skill, many seek to engage with opponents or teammates of similar proficiency for a balanced and enjoyable experience.

Inspired by our individual struggles to find sporting buddies, this realisation sparked our mission to create a solution that seamlessly connects like-minded individuals, fostering enjoyable and fulfilling sporting experiences.

**User Stories:**

As a user who wants to find compatible players to engage in new sports with, I want to be able to search and filter for potential players based on a specified criteria such as my sport of interest, the proficiency of the other players, and many more criteria. Therefore, this will allow me to find the best possible match that I will be satisfied to play with.

As a prospective user who wishes to create a comprehensive and tailored profile within the system, I want to be able to access a user login and authentication system that allows me to create and maintain a personalized profile, ensuring an accurate representation of my athletic abilities and preferences, while also obscuring my personal details.

As individuals who have been matched and desire to know more about different amenities that are in the surroundings of a particular sporting facility, I want to be able to search for a sporting facility in the web application and I want to be able to see the various categories of nearby amenities such as food, parking, and many more. I also want the web application to be able to display the names and addresses of these places upon clicking on them.

As a user who has been successfully matched with potential sporting partners, who wants to establish a rapport and coordinate logistics prior to meeting in person, I want to be able to chat, interact and communicate with my sporting partner without having to exchange any personal details.

## Features

User Matching Feature (core): Our web application allows users to create and submit requests for different sports. Users can specify their sport of interest, preferred location, date and time of the activity that they wish to engage in. If the user is not able to make it for their booking, they can cancel their active request. Users can then view these requests and filter them out based on the sport or the location. By considering such factors, users can send requests to one another, view their sent requests and accept or decline any incoming requests. Should a user accept a request, the booking will reflect on their main dashboard page together with the sport, location, date, time and partner that they will be playing with. Users can mark confirmed matches as complete once they have carried out the activity.

Personalised User Profiles and Authentication System (core): The web application offers a secure user authentication system for creating customized profiles. Users can showcase their current sports engagements, proficiency in various activities, and more, providing a comprehensive overview of their sporting interests and abilities.

Proximity-Based Amenities Finder (core): Leveraging geolocation data, the platform identifies nearby amenities suitable for users. By providing a range of options to choose from such as Transportation, Food and many more, MatchFixing makes it as convenient as possible for users as they do not have to navigate out of the web application to locate nearby amenities. Users can view the names and also the addresses of the different places as well.

Direct Messaging System (extension): Users can engage in communication through a dedicated chat interface, allowing matched individuals to interact online before meeting in person. This feature enhances user experience by facilitating pre-meetup discussions and planning. Similar to a forum and its reply system, we implement a chat feature which allows users to plan their meeting before the actual match.

## Scope Of Project

The web application provides a straightforward user interface for users to select their respective sports and match based on certain criteria

## Tech Stack

**Front-End:**

    1. React.js

    2. TypeScript

    3. Next.js

**Back-End:**

    1. Next.js

    2. Clerk (Authentication)

    3. Supabase + PostgresSQL (Database)

**Version Control:**

    1. GitHub


## Running the project
Link to deployment: https://matchfixing-orbital24.vercel.app/

Alternatively:
Our Project Runs on Next.js

Install these dependencies to run the project:

```bash
npm install
npm install next@latest react@latest react-dom@latest
npm install vercel
npm install @clerk/nextjs
npm install @clerk/clerk-react
npm install xlsx
npx shadcn@latest init
npx shadcn@latest add table
npx shadcn@latest add tabs
npx shadcn@latest add sidebar
```
### Open [http://localhost:3000](http://localhost:3000) with your browser to see the result

## Key Features of the System
1. **For Residents**:
   1. User-friendly dashboard to view voucher balances, transaction history, and available products.
   2. Easily request items from the minimart or place preorders for out-of-stock products. 
   3. Login System With Secure Authentication
2. **For Admins**:
   1. Manage users through Clerk, a secure authentication system. 
   2. Approve or reject voucher tasks and product requests with detailed tracking.
   3. View and manage transaction history and user balances.
   4. Export information to an Excel file for easy record-keeping.

## Software Development Process

### Initial Planning/Development Scope
1. **Requirement Gathering**:
    1. Identify the core features required for the web minimart application.
    2. Define user roles and their respective functionalities (e.g., Residents, Admins).
    3. Gather requirements for the voucher management system, product request system, and authentication system.
2. **Design**:
    1. Create wireframes and mockups for the user interface.
    2. Design the database schema for storing user information, voucher balances, transaction history, and product details.
    3. Plan the API endpoints for interacting with the database.
3. **Development**:
    1. Set up the development environment with necessary tools and dependencies.
    2. Implement the front-end using React.js, TypeScript, and Next.js.
    3. Develop the back-end using Next.js, Clerk for authentication, and Supabase with PostgreSQL for the database.
    4. Integrate the front-end and back-end, ensuring secure communication and data handling.
4. **Deployment**:
    1. Deploy the application on Vercel for easy access and testing.
    2. Test the application for functionality, performance, and security.
    3. Address any bugs or issues identified during testing.