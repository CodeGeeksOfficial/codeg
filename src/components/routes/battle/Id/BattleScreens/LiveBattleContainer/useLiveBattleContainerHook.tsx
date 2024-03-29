import { doc, getFirestore, onSnapshot } from 'firebase/firestore'
import router from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { apiCall } from 'src/core/api-requests/axios'
import { setCurrentBattleState } from 'src/core/redux/reducers/battleSlice'
import { firebaseApp } from 'src/firebase/firebase.config'
import { useAuth } from 'src/utils/auth'
import userBattleSubmissionsMapper from 'src/utils/userBattleSubmissionsMapper'

const useLiveBattleContainerHook = () => {

  const battleId = router.query.id
  const dispatch = useDispatch();
  const battle = useSelector((state: any) => state.battle)
  const { currentUser } = useAuth();

  useEffect(() => {
    const db = getFirestore(firebaseApp);
    const battleDocRef = doc(db, "battles", `${battleId}`);
    console.log("Subscribed");
    const unsubscribe = onSnapshot(battleDocRef, async (doc) => {
      let docData = doc.data();

      if (docData) {

        if (docData.activeUsers && !docData.activeUsers.includes(currentUser.uid)) {
          router.push('/battle')
        }

        const usersData = (battle.usersData) || {};
        let newUsersData: any = {};

        await Promise.all(docData.activeUsers.map(async (userId: any) => {
          if (usersData[userId]) {
            newUsersData[userId] = usersData[userId]
          } else {
            const userData = (await apiCall({ key: "get_user_details_by_id", params: { user_id: userId } }) as any).data
            newUsersData[userId] = userData;
          }
        }));

        let isUserAdmin = false;
        if (docData.activeUsers && docData.activeUsers.length > 0 && docData.activeUsers[0] === currentUser.uid) {
          isUserAdmin = true;
        }

        let submissionsData = {}
        let questionsData = []

        if (!battle.questionsData || battle?.questionsData.length === 0) {
          questionsData = await Promise.all(battle.questions.map(async (qId: string) => {
            let question = (await apiCall({ key: "fetch_question", params: { question_id: qId } }) as any).data
            question = { ...question, id: qId };
            return question;
          }));
        } else {
          questionsData = battle?.questionsData
        }

        if (!battle?.submissionsData && questionsData?.length !== 0) {
          const userSumbissons: any = (await apiCall({ key: 'get_user_battle_submissions', params: { battle_id: battle?.id } }) as any).data
          submissionsData = userBattleSubmissionsMapper(questionsData, userSumbissons)
        } else {
          submissionsData = battle?.submissionsData
        }
        dispatch(setCurrentBattleState({
          ...docData,
          id: doc.id,
          status: (battle && battle.status) ? battle.status : (docData.startedAt ? "arena" : "lobby"),
          usersData: newUsersData,
          createdAt: docData.createdAt.toDate().getTime(),
          startedAt: docData.startedAt ? docData.startedAt.toDate().getTime() : null,
          isUserAdmin: isUserAdmin,
          questionsData,
          submissionsData,
        }));
      }
    })

    return () => {
      console.log("Unsubscribed")
      unsubscribe()
    }

  }, [])


  return { battle }
}

export default useLiveBattleContainerHook
