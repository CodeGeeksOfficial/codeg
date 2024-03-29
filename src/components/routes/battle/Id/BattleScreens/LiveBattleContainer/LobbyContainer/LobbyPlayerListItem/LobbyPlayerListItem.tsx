import React from 'react'
import useLobbyPlayerListItem from './useLobbyPlayerListItem'
import Image from 'next/image'
import { useAuth } from 'src/utils/auth'
import Button from 'src/components/common/Button/Button'

type Props = {
  userId: any
  isUserAdmin:boolean
}

const LobbyPlayerListItem = ({ userId, isUserAdmin }: Props) => {

  const { battle, isListPlayerAdmin, removeFromBattleButtonLoading, handleRemoveFromBattle } = useLobbyPlayerListItem(userId);

  return (
    <div className={`flex py-4 px-6 bg-gray-800 ${isListPlayerAdmin && "border-[2px]"} border-orange-900 rounded-lg my-4 font-medium items-center justify-between relative`}>
      {isListPlayerAdmin && <p className='px-4 py-[2px] rounded-full absolute right-6 -top-3 bg-orange-900 text-xs'>Admin</p>}
      <div className='flex items-center gap-4'>
        <Image
          src={battle.usersData[userId].photoUrl}
          alt=''
          width={50}
          height={50}
          className='w-8 h-8 rounded-full' />
        <p>{battle.usersData[userId].name}</p>
      </div>
      <div className='flex gap-6'>
        {!isListPlayerAdmin && isUserAdmin &&
          <Button
            loaderColor='red'
            loading={removeFromBattleButtonLoading}
            className='flex w-full justify-center text-red-500 font-normal tracking-wide '
            onClick={handleRemoveFromBattle}
          >
            Remove
          </Button>
        }
      </div>
    </div>
  )
}

export default LobbyPlayerListItem