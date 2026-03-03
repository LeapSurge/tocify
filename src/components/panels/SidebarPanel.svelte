<script lang="ts">
  import {fade} from 'svelte/transition';
  import {t} from 'svelte-i18n';
  import {createEventDispatcher} from 'svelte';

  import Header from '../Header.svelte';
  import ApiSetting from '../settings/ApiSetting.svelte';
  import TocSettings from '../settings/TocSetting.svelte';
  import AiPageSelector from '../PageSelector.svelte';
  import TocEditor from '../TocEditor.svelte';
  import {Sparkles} from 'lucide-svelte';
  import {curFileFingerprint} from '../../stores';

  export let stage: 1 | 2 | 3 = 1;
  export let pdfState: any;
  export let originalPdfInstance: any;
  export let previewPdfInstance: any;
  export let isAiLoading = false;
  export let aiError: string | null = null;

  export let tocRanges: {start: number; end: number; id: string}[];
  export let activeRangeIndex: number;
  export let addPhysicalTocPage: boolean;
  export let isTocConfigExpanded: boolean;

  export let config: any;
  export let customApiConfig: any;
  export let tocPageCount: number;
  export let isPreviewMode: boolean;
  export let hasToc = false;
  export let apiConfigDirty = false;
  export let stageOneDone = false;
  export let stageTwoDone = false;

  const dispatch = createEventDispatcher();

  $: stageOneBlockedReason = !originalPdfInstance
    ? $t('wizard.reason_upload_first')
    : '';
  $: stageTwoBlockedReason = !hasToc ? $t('wizard.reason_toc_empty') : '';
</script>

<div class="w-full lg:w-[35%]">
  <Header on:openhelp={() => dispatch('openhelp')} />

  <div class="mb-3 grid grid-cols-3 gap-2">
    <div class="text-center border-2 border-black rounded-md py-1 text-xs font-bold" class:bg-blue-300={stage >= 1}>
      {$t('wizard.step1')}
      {#if stageOneDone}<span class="ml-1 text-[10px]">{$t('progress.done')}</span>{:else if stage === 1}<span class="ml-1 text-[10px]">{$t('progress.current')}</span>{/if}
    </div>
    <div class="text-center border-2 border-black rounded-md py-1 text-xs font-bold" class:bg-blue-300={stage >= 2}>
      {$t('wizard.step2')}
      {#if stageTwoDone}<span class="ml-1 text-[10px]">{$t('progress.done')}</span>{:else if stage === 2}<span class="ml-1 text-[10px]">{$t('progress.current')}</span>{/if}
    </div>
    <div class="text-center border-2 border-black rounded-md py-1 text-xs font-bold" class:bg-blue-300={stage >= 3}>
      {$t('wizard.step3')}
      {#if stage === 3}<span class="ml-1 text-[10px]">{$t('progress.current')}</span>{/if}
    </div>
  </div>

  <div class="mb-3 text-sm text-gray-700 border-2 border-black rounded-lg bg-white p-3 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
    {#if stage === 1}
      {$t('wizard.desc_1')}
    {:else if stage === 2}
      {$t('wizard.desc_2')}
    {:else}
      {$t('wizard.desc_3')}
    {/if}
  </div>

  {#if stage === 1}
    <ApiSetting
      on:change={(e) => dispatch('apiConfigChange', e.detail)}
      on:save={() => dispatch('apiConfigSave')}
      on:dirtyChange={(e) => dispatch('apiConfigDirtyChange', e.detail)}
    />

    {#if apiConfigDirty}
      <div class="my-2 text-xs text-amber-800 bg-amber-100 border border-amber-300 rounded px-2 py-1">
        {$t('wizard.api_dirty')}
      </div>
    {/if}

    {#if originalPdfInstance}
      <div transition:fade={{duration: 200}}>
        <AiPageSelector
          bind:tocRanges
          bind:activeRangeIndex
          totalPages={pdfState.totalPages}
          pageLabelSettings={config.pageLabelSettings}
          on:addRange
          on:removeRange
          on:setActiveRange
          on:rangeChange={() => dispatch('rangeChange')}
          on:updateField={(e) => dispatch('updateField', e.detail)}
        />
      </div>
    {/if}

    <button
      class="btn w-full my-2 font-bold bg-blue-400 transition-all duration-300 text-black border-2 border-black rounded-lg px-3 py-2 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] disabled:bg-gray-300 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
      on:click={() => dispatch('startStageTwo')}
      title={isAiLoading
        ? $t('status.generating')
        : stageOneBlockedReason || $t('wizard.start')}
      disabled={isAiLoading || !!stageOneBlockedReason}
    >
      {#if isAiLoading}
        <span>{$t('btn.generating')}</span>
      {:else}
        <span>
          <Sparkles
            size={16}
            class="inline-block mr-1"
          />
          {$t('wizard.start')}</span
        >
      {/if}
    </button>

    {#if stageOneBlockedReason}
      <div class="text-xs text-gray-600 mt-1">{stageOneBlockedReason}</div>
    {/if}

    {#if aiError}
      <div class="my-2 p-3 bg-red-100 border-2 border-red-700 text-red-700 rounded-lg">
        {aiError}
      </div>
    {/if}
  {/if}

  {#if stage === 2}
    {#key $curFileFingerprint}
      <TocEditor
        on:hoveritem
        on:jumpToPage={(e) => { dispatch('jumpToPage', e.detail); }}
        currentPage={pdfState.currentPage}
        isPreview={isPreviewMode}
        pageOffset={config.pageOffset}
        insertAtPage={config.insertAtPage}
        apiConfig={customApiConfig}
        {tocPageCount}
      />
    {/key}

    <div class="flex gap-2 mt-3">
      <button
        class="btn flex-1 font-bold bg-white text-black border-2 border-black rounded-lg px-3 py-2 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        on:click={() => dispatch('goStageOne')}
      >
        {$t('wizard.prev')}
      </button>
      <button
        class="btn flex-1 font-bold bg-blue-400 text-black border-2 border-black rounded-lg px-3 py-2 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:bg-gray-300 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
        on:click={() => dispatch('goStageThree')}
        disabled={!!stageTwoBlockedReason}
        title={stageTwoBlockedReason || $t('wizard.next')}
      >
        {$t('wizard.next')}
      </button>
    </div>

    {#if stageTwoBlockedReason}
      <div class="text-xs text-gray-600 mt-1">{stageTwoBlockedReason}</div>
    {/if}
  {/if}

  {#if stage === 3}
    <TocSettings
      {config}
      {previewPdfInstance}
      tocRanges={tocRanges}
      totalPages={pdfState.totalPages}
      bind:isTocConfigExpanded
      bind:addPhysicalTocPage
      on:toggleExpand={() => (isTocConfigExpanded = !isTocConfigExpanded)}
      on:updateField={(e) => dispatch('updateField', e.detail)}
      on:jumpToTocPage={() => dispatch('jumpToTocPage')}
    />

    <div class="flex gap-2 mt-3">
      <button
        class="btn flex-1 font-bold bg-white text-black border-2 border-black rounded-lg px-3 py-2 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        on:click={() => dispatch('goStageTwo')}
      >
        {$t('wizard.prev')}
      </button>
      <button
        class="btn flex-1 font-bold bg-green-500 text-black border-2 border-black rounded-lg px-3 py-2 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        on:click={() => dispatch('export')}
      >
        {$t('btn.generate_pdf')}
      </button>
    </div>
  {/if}
</div>
