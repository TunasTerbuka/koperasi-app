package com.koperasichain.states

import net.corda.core.contracts.*
import net.corda.core.identity.Party
import java.time.LocalDate

@CordaSerializable
enum class TransactionType { INCOME, EXPENSE, DIVIDEND, LOAN }
@CordaSerializable
enum class TransactionCategory { AGRICULTURE, INFRASTRUCTURE, SOCIAL, EQUIPMENT, EMERGENCY, OTHER }

@BelongsToContract(TransactionContract::class)
data class TransactionState(
    val transactionType: TransactionType,
    val amount: Double,
    val description: String,
    val date: LocalDate,
    val category: TransactionCategory,
    val memberId: String?,
    val hash: String?,
    val verified: Boolean = false,
    override val participants: List<Party>
) : ContractState
