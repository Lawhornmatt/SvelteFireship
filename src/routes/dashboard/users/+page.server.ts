import type { PageServerLoad } from './$types';
import { adminAuth, adminDB } from "$lib/server/admin";
import { collection, getDocs, limit, query, where } from "firebase/firestore"
import { db } from "$lib/firebase";
import { error, redirect, fail } from "@sveltejs/kit";

export const load = (async ({ locals }) => {
    
    console.log('Querying DB for all usernames');

    const fakeData = [
        {
          username: 'blahblah',
          published: true,
          photoURL: 'https://firebasestorage.googleapis.com/v0/b/fireship-svelte-tut.appspot.com/o/users%2FMB8lYGo9AKaj6guaY4ORKy0s1ts2%2Fprofile.png?alt=media&token=00360b1d-c64e-433c-a671-f785be15a9cf'
        },
        {
          username: 'myprofile',
          published: true,
          photoURL: 'https://firebasestorage.googleapis.com/v0/b/fireship-svelte-tut.appspot.com/o/users%2FmAxney3dtscTPjhzKqEhlY9oP4J3%2Fprofile.png?alt=media&token=05a0d4f0-1be5-4443-b605-9c2d7f7c41f5'
        },
        {
          username: 'MattIsSmelly',
          published: true,
          photoURL: 'https://firebasestorage.googleapis.com/v0/b/fireship-svelte-tut.appspot.com/o/users%2FwSGaTv1vcygPhkIxiiFSHoXeas22%2Fprofile.png?alt=media&token=bb219639-903d-4be1-895e-2e8d7a405ad1'
        }
    ];

    return {fakeData};

    /*
    const collectionRef = collection(db, "users");
    const usersSnapshot = await getDocs(collectionRef);

    const exists = usersSnapshot.docs[0]?.exists();
    if (!exists) {
        throw error(404, "No users found!");
    };

    const data = usersSnapshot.docs.map((doc) => { 
        let stract = doc.data();
        return { 
            username: stract.username,
            published: stract.published,
            photoURL: stract.photoURL 
        };
    });

    return {data.filter((doc) => doc.published)};
    */

    // console.log(publishedData);

    // const usernameArray: any = [];
    // usernamesSnapshot.forEach((doc) => usernameArray.push(doc.id));
    // console.log(usernameArray);

}) satisfies PageServerLoad;