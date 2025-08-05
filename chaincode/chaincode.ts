import { Context, Contract } from 'fabric-contract-api';

interface Member {
  full_name: string;
  village_address: string;
  phone_number: string;
  member_id: string;
  join_date?: string;
  member_type?: 'founding' | 'regular' | 'honorary';
  total_contributions?: number;
  active_status?: boolean;
}

interface Contribution {
  member_id: string;
  contribution_type: 'money' | 'goods' | 'labor' | 'land';
  amount: number;
  description: string;
  date: string;
  verified?: boolean;
  hash?: string;
}

interface Transaction {
  transaction_type: 'income' | 'expense' | 'dividend' | 'loan';
  amount: number;
  description: string;
  date: string;
  category: 'agriculture' | 'infrastructure' | 'social' | 'equipment' | 'emergency' | 'other';
  member_id?: string;
  hash?: string;
  verified?: boolean;
}

interface Resource {
  name: string;
  category: 'equipment' | 'facility' | 'vehicle' | 'land' | 'other';
  description: string;
  availability?: boolean;
  cost_per_use?: number;
  location?: string;
  maintenance_date?: string;
}

interface CastVote {
  member_id: string;
  choice: string;
  timestamp: string;
}

interface Vote {
  title: string;
  description: string;
  vote_type?: 'yes_no' | 'multiple_choice' | 'ranking';
  options?: string[];
  start_date: string;
  end_date: string;
  status?: 'draft' | 'active' | 'closed' | 'cancelled';
  votes_cast?: CastVote[];
}

export class CooperativeChaincode extends Contract {
  // ==== Member Operations ====

  async createMember(ctx: Context, memberId: string, memberJson: string): Promise<void> {
    const exists = await this.memberExists(ctx, memberId);
    if (exists) {
      throw new Error(`Member ${memberId} already exists`);
    }
    const member: Member = JSON.parse(memberJson);
    member.member_id = memberId;
    member.total_contributions = member.total_contributions ?? 0;
    member.active_status = member.active_status ?? true;

    await ctx.stub.putState(memberId, Buffer.from(JSON.stringify(member)));
  }

  async readMember(ctx: Context, memberId: string): Promise<string> {
    const data = await ctx.stub.getState(memberId);
    if (!data || data.length === 0) {
      throw new Error(`Member ${memberId} does not exist`);
    }
    return data.toString();
  }

  async updateMember(ctx: Context, memberId: string, updateJson: string): Promise<void> {
    const memberStr = await this.readMember(ctx, memberId);
    const member: Member = JSON.parse(memberStr);
    const updates = JSON.parse(updateJson);
    Object.assign(member, updates);
    await ctx.stub.putState(memberId, Buffer.from(JSON.stringify(member)));
  }

  async memberExists(ctx: Context, memberId: string): Promise<boolean> {
    const data = await ctx.stub.getState(memberId);
    return data && data.length > 0;
  }

  // ==== Contribution Operations ====

  async createContribution(ctx: Context, contributionId: string, contributionJson: string): Promise<void> {
    const exists = await this.contributionExists(ctx, contributionId);
    if (exists) {
      throw new Error(`Contribution ${contributionId} already exists`);
    }
    const contribution: Contribution = JSON.parse(contributionJson);
    contribution.verified = contribution.verified ?? false;

    // Save contribution
    await ctx.stub.putState(contributionId, Buffer.from(JSON.stringify(contribution)));

    // Update member's total contributions if verified and money type
    if (contribution.verified && contribution.contribution_type === 'money') {
      await this.addContributionToMember(ctx, contribution.member_id, contribution.amount);
    }
  }

  async contributionExists(ctx: Context, contributionId: string): Promise<boolean> {
    const data = await ctx.stub.getState(contributionId);
    return data && data.length > 0;
  }

  async addContributionToMember(ctx: Context, memberId: string, amount: number): Promise<void> {
    const memberStr = await this.readMember(ctx, memberId);
    const member: Member = JSON.parse(memberStr);
    member.total_contributions = (member.total_contributions ?? 0) + amount;
    await ctx.stub.putState(memberId, Buffer.from(JSON.stringify(member)));
  }

  // ==== Transaction Operations ====

  async createTransaction(ctx: Context, transactionId: string, transactionJson: string): Promise<void> {
    const exists = await this.transactionExists(ctx, transactionId);
    if (exists) {
      throw new Error(`Transaction ${transactionId} already exists`);
    }
    const transaction: Transaction = JSON.parse(transactionJson);
    transaction.verified = transaction.verified ?? false;

    await ctx.stub.putState(transactionId, Buffer.from(JSON.stringify(transaction)));
  }

  async transactionExists(ctx: Context, transactionId: string): Promise<boolean> {
    const data = await ctx.stub.getState(transactionId);
    return data && data.length > 0;
  }

  // ==== Resource Operations ====

  async createResource(ctx: Context, resourceId: string, resourceJson: string): Promise<void> {
    const exists = await this.resourceExists(ctx, resourceId);
    if (exists) {
      throw new Error(`Resource ${resourceId} already exists`);
    }
    const resource: Resource = JSON.parse(resourceJson);
    resource.availability = resource.availability ?? true;
    resource.cost_per_use = resource.cost_per_use ?? 0;

    await ctx.stub.putState(resourceId, Buffer.from(JSON.stringify(resource)));
  }

  async resourceExists(ctx: Context, resourceId: string): Promise<boolean> {
    const data = await ctx.stub.getState(resourceId);
    return data && data.length > 0;
  }

  // ==== Vote Operations ====

  async createVote(ctx: Context, voteId: string, voteJson: string): Promise<void> {
    const exists = await this.voteExists(ctx, voteId);
    if (exists) {
      throw new Error(`Vote ${voteId} already exists`);
    }
    const vote: Vote = JSON.parse(voteJson);
    vote.status = vote.status ?? 'draft';
    vote.vote_type = vote.vote_type ?? 'yes_no';
    vote.votes_cast = vote.votes_cast ?? [];

    await ctx.stub.putState(voteId, Buffer.from(JSON.stringify(vote)));
  }

  async voteExists(ctx: Context, voteId: string): Promise<boolean> {
    const data = await ctx.stub.getState(voteId);
    return data && data.length > 0;
  }

  // You can add update, query, and delete methods for all entities similarly...

  // Example: Query all members (basic pagination can be added)
  async queryAllMembers(ctx: Context): Promise<string> {
    const iterator = await ctx.stub.getStateByRange('', '');
    const allResults = [];
    while (true) {
      const res = await iterator.next();
      if (res.value && res.value.value.toString()) {
        const record = JSON.parse(res.value.value.toString('utf8'));
        if (record.member_id) {
          allResults.push(record);
        }
      }
      if (res.done) {
        await iterator.close();
        break;
      }
    }
    return JSON.stringify(allResults);
  }
}
