package com.koperasichain.states

import net.corda.core.contracts.*
import net.corda.core.identity.Party
import java.time.LocalDate

@CordaSerializable
enum class VoteType { YES_NO, MULTIPLE_CHOICE, RANKING }
@CordaSerializable
enum class VoteStatus { DRAFT, ACTIVE, CLOSED, CANCELLED }

data class CastVote(
    val memberId: String,
    val choice: String,
    val timestamp: String
)

@BelongsToContract(VoteContract::class)
data class VoteState(
    val title: String,
    val description: String,
    val voteType: VoteType = VoteType.YES_NO,
    val options: List<String> = listOf(),
    val startDate: LocalDate,
    val endDate: LocalDate,
    val status: VoteStatus = VoteStatus.DRAFT,
    val votesCast: List<CastVote> = listOf(),
    override val participants: List<Party>
) : ContractState
