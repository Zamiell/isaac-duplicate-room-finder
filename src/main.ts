import { CollectibleType, RoomType } from "isaac-typescript-definitions";
import {
  ModCallbackCustom,
  arrayRemoveAllInPlace,
  game,
  getArrayDuplicateElements,
  getRoomDescriptorsForType,
  isArrayElementsUnique,
  log,
  logArray,
  onSetSeed,
} from "isaacscript-common";
import { mod } from "./mod";

const ROOM_TYPE_TO_LOOK_FOR = RoomType.DEFAULT;
const STARTING_ROOM_VARIANT = 2;

export function main(): void {
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_GAME_STARTED_REORDERED,
    postGameStartedReorderedFalse,
    false,
  );
}

// ModCallbackCustom.POST_GAME_STARTED_REORDERED
function postGameStartedReorderedFalse() {
  if (onSetSeed()) {
    log("On set seed; not doing anything.");
    return;
  }

  const seeds = game.GetSeeds();
  const startSeedString = seeds.GetStartSeedString();
  log(`POST_GAME_STARTED_REORDERED - ${startSeedString}`);

  const roomDescriptors = getRoomDescriptorsForType(ROOM_TYPE_TO_LOOK_FOR);
  const roomVariants = roomDescriptors.map(
    (roomDescriptor) => roomDescriptor.Data?.Variant ?? -1,
  );
  arrayRemoveAllInPlace(roomVariants, STARTING_ROOM_VARIANT);

  if (isArrayElementsUnique(roomVariants)) {
    mod.restartNextRenderFrame();
  } else {
    const duplicateElements = getArrayDuplicateElements(roomVariants);
    log("Room variants on the floor:");
    logArray(roomVariants, "roomVariants");

    log("The following room variants are unique:");
    logArray(duplicateElements, "duplicateElements");

    const player = Isaac.GetPlayer();
    player.AddCollectible(CollectibleType.MIND);
  }
}
