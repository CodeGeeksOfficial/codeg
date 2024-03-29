import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { apiCall } from 'src/core/api-requests/axios';
import { setCurrentBattleState } from 'src/core/redux/reducers/battleSlice';

const useBattleIdContainerHook = () => {

  const [loading, setLoading] = useState(true);
  const [userCurrentBattleId, setUserCurrentBattleId] = useState<any>();

  const battleData = useSelector((state: any) => state.battle)
  const dispatch = useDispatch();
  const router = useRouter()

  const toast = useToast();

  // If userCurrentBattleId!==null and userCurrentBattleId!==battleId, redirect to his ongoing battle and show a toast message.
  // If Battle status is null => show BattleNotFoundScreen
  // If battle is in completed state => show BattleEndedScreen
  // If battle is in lobby or arena state and userCurrentBattleId===battleId => show LiveBattleContainer
  // If battle is in lobby state and userCurrentBattleId===null => show JoinBattleButton
  // If battle is in arena state and userCurrentBattleId===null => show BattleAlreadyStartedScreen

  const battleId: any = router.query.id;

  const fetchBattleAndUserDetails = async () => {
    setLoading(true);
    const userCurrentBattleIdProcess: any = apiCall({ key: "get_battle_id" });
    const battleDataProcess: any = apiCall({ key: "get_battle_details_by_id", params: { battle_id: battleId } });

    const userCurrentBattleIdRes = (await userCurrentBattleIdProcess).data;
    const battleDataRes = (await battleDataProcess).data

    if (userCurrentBattleIdRes !== null && userCurrentBattleIdRes !== battleId) {
      toast({
        title: 'You already are in a battle',
        description: "We've redirected you to your battle. Happy coding!",
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top'
      });
      router.push(`/battle/${userCurrentBattleIdRes}`)
      return;
    }

    setUserCurrentBattleId(userCurrentBattleIdRes);

    dispatch(setCurrentBattleState(battleDataRes))

    setLoading(false);
  }

  useEffect(() => {
    if(battleId){
      fetchBattleAndUserDetails();
    }
  }, [battleId])

  return { loading, battleData, userCurrentBattleId, battleId, setUserCurrentBattleId }
}

export default useBattleIdContainerHook
